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
| `likeCountsFor($models, $type)` | **1 + N** (N = distinct model types in the collection) | one `COUNT ... GROUP BY model_id` per type |
| `userInteractionsFor($models, $userId)` | **1 + N** (N = distinct model types in the collection) | one `SELECT` per type, keyed by model |

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

## Wrong way: loop calling `isLiked()` / `isDisliked()` / `isLoved()`

Each predicate is one `EXISTS` query — cheap for a single model, an N+1 for a list:

```php
// ❌ BAD — one EXISTS per post
$posts = Post::limit(50)->get();
foreach ($posts as $post) {
    $liked = $post->isLiked(); // N+1 query!
}
```

## Right way: batch the current user's state with `userInteractionsFor()`

```php
// ✅ GOOD — one query total
use CSlant\LaravelLike\Facades\Like;

$posts = Post::limit(50)->get();
$interactions = Like::userInteractionsFor($posts, auth()->id());

foreach ($posts as $post) {
    $key = $post->getMorphClass().':'.$post->getKey();
    $liked = $interactions->get($key)?->type->isLike() ?? false;
}
```

See [`userInteractionsFor()`](like_manager.md#userinteractionsfor--batch-interaction-check-for-a-list) for the full reference.

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

Even single-count queries can be expensive on very hot pages (a viral post, a trending feed). The package has **built-in** caching for `likesCount()` / `dislikesCount()` / `lovesCount()` — turn it on in config, no manual event wiring needed:

```php title="config/like.php"
'cache' => [
    'enabled' => true,
    'ttl' => 300, // seconds
],
```

```php
$post->likesCount(); // first call: 1 COUNT query, then cached
$post->likesCount(); // subsequent calls within the TTL: 0 queries
```

The cache is **automatically invalidated** by `like()`, `dislike()`, `love()`, `unlike()`, `unDislike()`, `unlove()`, and `toggle()` — you never get a stale count after a write made through the package. See [Configuration](../getting-started/configuration.md#cacheenabled) for details.

:::info Not cached by the package

`totalCount()` and the batched `likeCountsFor()` are **not** covered by `like.cache.enabled` — they're already single/bounded queries. If you write directly to the `likes` table bypassing the package (raw SQL, another service), the package cache won't know to invalidate; keep the TTL as a safety net for that case.

:::

If you need to cache something the package doesn't (a computed leaderboard, `likeCountsFor()`'s result, `totalCount()`), a manual `Cache::remember()` still works the same way it does for any Eloquent query:

```php
use Illuminate\Support\Facades\Cache;
use CSlant\LaravelLike\Facades\Like;

function hotPostTotalCount(Post $post): int
{
    return Cache::remember("post:{$post->id}:total_count", 300, fn () => Like::totalCount($post));
}
```

## Database indexes

The default migrations create two indexes on the `likes` table out of the box:

```
UNIQUE (user_id, model_id, model_type, type)   -- create_likes_table migration
INDEX  (model_type, model_id, type)            -- add_type_lookup_index_to_likes_table migration
```

The unique index serves user-scoped lookups (`isLiked()`, `findInteractionByType()`, `userInteractionsFor()`). The composite index serves the counts that are **not** scoped to a user (`likesCount()`, `dislikesCount()`, `lovesCount()`, `likeCountsFor()`). Both are published automatically by `vendor:publish --tag=migrations` — see [Installation](../getting-started/installation.md).

For very large tables with heavy `userInteractions()` or admin-side bulk-user queries, you may still want an extra index the package doesn't ship by default:

```php
public function up(): void
{
    Schema::table('likes', function (Blueprint $table) {
        // For userInteractions() or bulk user queries filtered by type
        $table->index(['user_id', 'type']);
    });
}
```

## Batch aggregation for lists and dashboards

Use [`likeCountsFor()`](like_manager.md#likecountsfor--batch-counts-for-a-list) instead of calling `likesCount()` per item — it runs one query per distinct model type in the collection, not one per row:

```php
use CSlant\LaravelLike\Facades\Like;
use CSlant\LaravelLike\Enums\InteractionTypeEnum;
use App\Models\Post;

$posts = Post::whereIn('id', $postIds)->get();

$counts = Like::likeCountsFor($posts, InteractionTypeEnum::LIKE);
// $counts is now [1 => 12, 3 => 47, ...] — keyed by model primary key
```

For ad-hoc analytics where you don't already have a `Collection` of models (e.g. you only have raw IDs), querying the `Like` model directly is equally cheap:

```php
use CSlant\LaravelLike\Models\Like;
use App\Models\Post;

$counts = Like::query()
    ->where('model_type', Post::class)
    ->where('type', 'like')
    ->whereIn('model_id', $postIds)
    ->selectRaw('model_id, count(*) as total')
    ->groupBy('model_id')
    ->pluck('total', 'model_id');
```

## Next Steps

- [The LikeManager & Facade API](like_manager.md) — full method reference
- [Counting interactions](counting_interactions.md) — aggregation recipes
- [Query scopes](query_scopes.md) — building reusable scopes