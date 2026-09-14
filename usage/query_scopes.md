---
title: Query Scopes | Laravel Like
description: Learn how to query and filter interactable content with the Laravel Like package, using relationships, whereHas, withCount, and custom scopes.
keywords: ['laravel like', 'query scopes', 'filtering', 'sorting', 'eloquent', 'database queries', 'whereHas', 'withCount']
tags: ['Query Scopes', 'Filtering', 'Sorting', 'Eloquent', 'Performance', 'Tutorial']
---

# Querying and Filtering Interactable Content

This guide covers how to query interactable content. The package intentionally does **not** ship global query scopes on content models — instead it gives you rich relationship helpers, and you compose your own queries (and local scopes) with standard Eloquent.

## Prerequisites

- [Installation](../getting-started/installation.md) completed
- `HasLike` / `HasLove` trait on your content model

## What the package provides

These are the query-building building blocks:

| Helper | Kind | Purpose |
| --- | --- | --- |
| `likes()` | `MorphMany` | all interactions of a model |
| `likeTo()` / `dislikeTo()` | `MorphOne` | the model's like / dislike singleton |
| `likesTo()` / `dislikesTo()` | `MorphMany` | a model's likes / dislikes |
| `loveTo()` / `lovesTo()` | `MorphMany` | a model's loves (requires `HasLove`) |
| `withInteractionBy($userId, ?enum)` | `MorphMany` | a user's interactions on a model |
| `Like::withModelType($class)` | Eloquent scope | filter `Like` records by model class |
| `Like::where('type', ...)` | Eloquent | filter by interaction type |

## Filtering a user's interactions on a model

```php
use CSlant\LaravelLike\Enums\InteractionTypeEnum;

$post = Post::find(1);
$userId = auth()->id();

// All of this user's interactions on the post
$rows = $post->withInteractionBy($userId)->get();

// Only likes
$likes = $post->withInteractionBy($userId, InteractionTypeEnum::LIKE)->get();

// Exists check (queries with EXISTS, no N+1)
$liked = $post->withInteractionBy($userId, InteractionTypeEnum::LIKE)->exists();
```

## Filter content by interaction count

Use Eloquent's `whereHas()` with the pre-filtered relations. Because `likesTo()`/`dislikesTo()`/`lovesTo()` are already filtered to a single type, the inner constraint is usually unnecessary:

```php
// Posts with at least 10 likes (from any users)
$popular = Post::whereHas('likesTo', fn ($q) => $q, '>=', 10)->get();

// Or without the redundant closure (PHP 8.0+ allows omitting it entirely):
$popular = Post::whereHas('likesTo', '>=', 10)->get();

// Posts with at least 5 dislikes
$controversial = Post::whereHas('dislikesTo', '>=', 5)->get();

// Posts with NO dislikes
$clean = Post::whereDoesntHave('dislikesTo')->get();
```

When you do need a custom constraint inside the relation, pass a closure:

```php
// Posts with at least 10 likes created in the last week
$recentlyPopular = Post::whereHas('likesTo', function ($q) {
    $q->where('created_at', '>=', now()->subWeek());
}, '>=', 10)->get();
```

## Filter by exact user

Need "posts this specific user liked"? Two options.

**Option A — relationship on the Post** (matches the user's interactions):

```php
$likedByUser = Post::whereHas('likes', function ($q) use ($userId) {
    $q->where('user_id', $userId)
      ->where('type', 'like');
})->get();
```

**Option B — start from the User side** (returns `Like` rows, or the models via the morph):

```php
$likedPosts = \CSlant\LaravelLike\Models\Like::withModelType(Post::class)
    ->where('user_id', $userId)
    ->where('type', 'like')
    ->with('model')
    ->get()
    ->pluck('model');
```

## Sorting by interaction count

```php
// Posts sorted by like count, descending
$trending = Post::query()
    ->withCount('likesTo as likes_count')
    ->orderBy('likes_count', 'desc')
    ->paginate(15);
```

Combine counts for popularity scores:

```php
// Posts with a like-heavy ratio
$highQuality = Post::query()
    ->withCount([
        'likesTo as likes_count',
        'dislikesTo as dislikes_count',
    ])
    ->orderByDesc('likes_count')
    ->get();
```

## Writing your own local scopes

Wrap the building blocks above into reusable local scopes on your models:

```php
class Post extends Model
{
    use HasLike, HasLove;

    public function scopePopular($query, int $minLikes = 10)
    {
        return $query->withCount('likesTo as likes_count')
            ->having('likes_count', '>=', $minLikes)
            ->orderBy('likes_count', 'desc');
    }

    public function scopeTrending($query, int $hours = 24, int $min = 5)
    {
        $cutoff = now()->subHours($hours);

        return $query->whereHas('likes', function ($q) use ($cutoff) {
                $q->where('created_at', '>=', $cutoff);
            }, '>=', $min)
            ->withCount(['likes as recent_likes' => function ($q) use ($cutoff) {
                $q->where('created_at', '>=', $cutoff);
            }])
            ->orderByDesc('recent_likes');
    }
}
```

Usage:

```php
$popular  = Post::popular(20)->get();                       // at least 20 likes
$trending = Post::trending(48, 10)->paginate(15);           // last 48h, ≥10 interactions
```

## Combining queries

Scopes chain like any Eloquent query:

```php
$results = Post::query()
    ->popular(50)
    ->where('published_at', '>=', now()->subWeek())
    ->orderByDesc('created_at')
    ->paginate(15);
```

## Performance tips

1. **Use `withCount`** — never call `$post->likesCount()` inside a loop.
2. **Prefer `EXISTS`** — predicates like `isLiked()` already use `whereExists`, which is cheap.
3. **Indexes** — the published migration already adds a unique index on `(user_id, model_id, model_type, type)`. For larger datasets consider extra indexes:

```php
public function up(): void
{
    Schema::table('likes', function (Blueprint $table) {
        $table->index(['model_type', 'model_id', 'type']);
        $table->index(['user_id', 'type']);
    });
}
```

4. **Cache hot lists** — wrap expensive sorted queries in `Cache::remember`.

## Next Steps

- [Filtering by interaction count](filtering_by_like_count.md) — popularity sorting
- [Counting interactions](counting_interactions.md) — aggregation recipes
- [The Like model](like_manager.md) — querying the shared interactions table