---
title: Performance | Laravel Like
description: Understand query-cost guarantees, N+1 prevention, and performance optimisation for the Laravel Like package.
keywords: ['laravel like', 'performance', 'N+1', 'query cost', 'eager loading', 'caching', 'database index', 'EXISTS']
tags: ['Performance', 'Optimization', 'N+1', 'Caching', 'Tutorial']
---

# Performance

This page explains the query-cost model behind Laravel Like and shows how to keep it fast at scale.

## N+1 guarantees

The package is designed to avoid per-row queries:

| Operation | Query count | Type |
| --- | --- | --- |
| `isLiked()` / `isDisliked()` / `isLoved()` | **1** per call | `EXISTS` |
| `likesCount()` / `dislikesCount()` / `lovesCount()` | **1** per call | `COUNT` |
| `totalCount()` (facade) | **1** per call | `COUNT` |
| `like()` / `dislike()` / `love()` | **1** (up to 3) | find + maybe delete + create — transaction |
| `unlike()` / `unDislike()` / `unlove()` | **1** per call | find + delete — transaction |
| `toggle()` | **1** | find + (create / delete / update) |
| `userInteractions()` | **1** | `SELECT` all rows |
| `userLikedModels()` | **1 + N** (N = distinct model types) | query the likes, then one per type |

:::info

None of these scale with the **number of rows**. Whether a user has 1 interaction or 10 000, `isLiked()` always costs exactly one query.

:::

## Wrong way: loop calling model helpers

Calling `likesCount()` in a loop will produce one `COUNT` query per item:

```php
// ❌ BAD — one COUNT per post
$posts = Post::limit(50)->get();
foreach ($posts as $post) {
    $count = $post->likesCount(); // N+1 query!
}
```

## Right way: eager-load counts

```php
// ✅ GOOD — one query total
$posts = Post::withCount([
    'likesTo as likes_count',
    'dislikesTo as dislikes_count',
    'lovesTo as loves_count',
])->limit(50)->get();

foreach ($posts as $post) {
    echo $post->likes_count; // already loaded
}
```

## Eager-loading interaction relationships

The `likes()` relation is a plain `MorphMany`. Standard Laravel eager loading applies:

```php
// Eager-load all interactions on a model
$post = Post::with('likes')->first();

foreach ($post->likes as $interaction) {
    echo $interaction->type;     // cast to InteractionTypeEnum
    echo $interaction->user;     // resolve the user too?
}
```

To eager-load the **user** as well:

```php
$post = Post::with('likes.user')->first();
```

To eager-load the **interacted model** starting from `User`:

```php
$user = User::with('likes.model')->find(1);

foreach ($user->likes as $like) {
    $like->model; // Post, Video... resolved in bulk
}
```

## `userLikedModels()` query cost

This method is intentionally bounded:

1. One `SELECT` on the `likes` table filtered to the user + type `like`.
2. Group the results by `model_type` (in-memory).
3. One `SELECT` per distinct model type: `SELECT ... WHERE id IN (…)`.
4. Combine into a single `Collection`.

That's `1 + (distinct model types)` queries. It does **not** grow with the number of liked items. For a user who liked 500 posts, it's still exactly 2 queries — not 500.

## Caching counts

Even single-count queries can be expensive on very hot pages. Cache them:

```php
use Illuminate\Support\Facades\Cache;
use CSlant\LaravelLike\Models\Like;

function hotPostLikeCount(int $postId): int
{
    return Cache::remember("post:{$postId}:likes_count", 3600, function () use ($postId) {
        return Like::where('model_id', $postId)
            ->where('model_type', \App\Models\Post::class)
            ->where('type', 'like')
            ->count();
    });
}
```

Invalidate with standard Eloquent events on the `Like` model:

```php
use CSlant\LaravelLike\Models\Like;

Like::saved(fn (Like $like) => Cache::forget("post:{$like->model_id}:likes_count"));
Like::deleted(fn (Like $like) => Cache::forget("post:{$like->model_id}:likes_count"));
```

Place these bindings in your `EventServiceProvider::boot()` or a listener class.

## Database indexes

The default published migration already creates a unique index:

```
UNIQUE (user_id, model_id, model_type, type)
```

That covers equality lookups by user + model + type. For large datasets, add composite indexes to cover the common query patterns:

```php
public function up(): void
{
    Schema::table('likes', function (Blueprint $table) {
        // For withCount('likesTo') — faster per-model aggregation
        $table->index(['model_type', 'model_id', 'type']);

        // For userInteractions() or bulk user queries
        $table->index(['user_id', 'type']);
    });
}
```

## Batch aggregation for analytics

For dashboards, avoid calling `likesCount()` per item — pull it all in one shot:

```php
use Illuminate\Support\Facades\DB;
use App\Models\Post;

$counts = DB::table('likes')
    ->select('model_id', \DB::raw('count(*) as total'))
    ->where('model_type', Post::class)
    ->where('type', 'like')
    ->whereIn('model_id', $postIds)
    ->groupBy('model_id')
    ->pluck('total', 'model_id');

// $counts is now ['1' => 12, '3' => 47, ...]
```

## Next Steps

- [The LikeManager & Facade API](like_manager.md) — full method reference
- [Counting interactions](counting_interactions.md) — aggregation recipes
- [Query scopes](query_scopes.md) — building reusable scopes