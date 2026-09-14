---
title: Counting Interactions | Laravel Like
description: Learn how to count and aggregate interactions (likes, dislikes, loves) in your Laravel application using the Laravel Like package.
keywords: ['laravel like', 'count interactions', 'like count', 'dislike count', 'love count', 'interaction statistics', 'likesCount']
tags: ['Interactions', 'Counting', 'Statistics', 'Aggregation', 'Tutorial']
---

# Counting Interactions

This guide explains how to count and aggregate interactions (likes, dislikes, and loves) on your Eloquent models using the Laravel Like package.

## Prerequisites

- [Installation](../getting-started/installation.md) completed
- `HasLike` trait for like/dislike counts, `HasLove` trait for love counts

## Count methods on the model

Available when the corresponding trait is added:

| Method | Trait | Returns | Description |
| --- | --- | --- | --- |
| `likesCount()` | `HasLike` | `int` | Number of likes |
| `dislikesCount()` | `HasLike` | `int` | Number of dislikes |
| `likesCountDigital()` | `HasLike` | `string` | Abbreviated like count (`1.2K`, `3M`) |
| `dislikesCountDigital()` | `HasLike` | `string` | Abbreviated dislike count |
| `lovesCount()` | `HasLove` | `int` | Number of loves |
| `lovesCountDigital()` | `HasLove` | `string` | Abbreviated love count |

```php
$post = Post::find(1);

$likes    = $post->likesCount();
$dislikes = $post->dislikesCount();
$loves    = $post->lovesCount();   // requires HasLove

echo $post->likesCountDigital();   // e.g. '1200' → '1.2K'
```

### How the digital format works

`countDigital()` (powered by the `count_digital()` helper) abbreviates large numbers:

| Input | Output |
| --- | --- |
| 999 | `999` |
| 1000 | `1K` |
| 12500 | `12.5K` |
| 999500+ | `1M` |
| 2500000 | `2.5M` |

## Total (all types) on the facade

`totalCount()` counts every interaction type on a model — but it lives on the **LikeManager / facade**, not on the model:

```php
use CSlant\LaravelLike\Facades\Like;

$total = Like::totalCount($post); // likes + dislikes + loves
```

## Counting via relationships

Counts are just single `COUNT` queries, so relationship-level counting works too:

```php
// All interaction rows (any type)
$post->likes()->count();

// Only likes
$post->likesTo()->count();

// Only dislikes
$post->dislikesTo()->count();

// Only loves (requires HasLove)
$post->lovesTo()->count();
```

## Eager-load counts for many models

Instead of calling `likesCount()` in a loop (that *would* be N+1), use `withCount()`:

```php
// Count of all interactions per post
$posts = Post::withCount('likes')->get();

// Count of likes, dislikes, and loves separately
$posts = Post::withCount([
    'likesTo as likes_count',
    'dislikesTo as dislikes_count',
    'lovesTo as loves_count',
])->get();

foreach ($posts as $post) {
    echo "{$post->likes_count} likes, {$post->dislikes_count} dislikes, {$post->loves_count} loves";
}
```

Already have a `Collection` of models from somewhere other than a fresh query (a cache, a search index) and can't reshape it into `withCount()`? Use [`likeCountsFor()`](like_manager.md#likecountsfor--batch-counts-for-a-list) instead — same one-query-per-model-type guarantee:

```php
use CSlant\LaravelLike\Facades\Like;
use CSlant\LaravelLike\Enums\InteractionTypeEnum;

$counts = Like::likeCountsFor($posts, InteractionTypeEnum::LIKE); // [postId => count]
```

:::info Relation names

The package exposes `likes()` plus filtered relations (`likesTo()`, `dislikesTo()`, `lovesTo()`, `likeOne()`, `dislikeTo()`, `loveTo()`). There are **no** `dislikes()` or `loves()` relationship methods — use `likesTo()`/`dislikesTo()`/`lovesTo()` with `withCount`.

:::

## Query the Like model directly

All interactions share one `Like` model, so query it directly for cross-model statistics:

```php
use CSlant\LaravelLike\Models\Like;

// Likes on a specific model class
$count = Like::where('model_type', Post::class)
    ->where('type', 'like')
    ->count();

// Or use the built-in scope
$count = Like::withModelType(Post::class)
    ->where('type', 'like')
    ->count();

// A specific user's likes
$userLikes = Like::where('user_id', 1)
    ->where('type', 'like')
    ->count();
```

## Aggregating by type

```php
// Interaction breakdown for one model ([type => count])
$breakdown = $post->likes()
    ->select('type', \DB::raw('count(*) as total'))
    ->groupBy('type')
    ->pluck('total', 'type');

// Example: ['like' => 5, 'dislike' => 2, 'love' => 3]
```

## Most-liked content

```php
// Top 5 posts by like count
$mostLiked = Post::query()
    ->withCount('likesTo as likes_count')
    ->orderBy('likes_count', 'desc')
    ->take(5)
    ->get();

// Top 5 by total interactions
$mostInteracted = Post::query()
    ->withCount('likes as interactions_count')
    ->orderBy('interactions_count', 'desc')
    ->take(5)
    ->get();
```

## Caching counts

Counts are plain `COUNT` queries, but on very hot pages you may still want to cache them. The package has **built-in** cache support for `likesCount()` / `dislikesCount()` / `lovesCount()` — enable it in config and the package invalidates it for you on every write:

```php title="config/like.php"
'cache' => [
    'enabled' => true,
    'ttl' => 300,
],
```

No manual `Cache::remember()` or event listeners needed. See [Performance → Caching counts](performance.md#caching-counts) and [Configuration](../getting-started/configuration.md#cacheenabled) for the full picture, including what the built-in cache does *not* cover (`totalCount()`, `likeCountsFor()`).

## Performance notes

- Every count above runs exactly **one** `SELECT COUNT(...)` query — no N+1.
- For listings, always prefer `withCount()` over calling `likesCount()` per item.
- See [Performance](performance.md) for the full picture.

## Next Steps

- [Filtering by interaction count](filtering_by_like_count.md) — sort content by popularity
- [Query scopes](query_scopes.md) — advanced queries
- [Customizing interactions](customizing_user_interaction.md) — extend the interaction model