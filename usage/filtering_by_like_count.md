---
title: Filtering by Interaction Counts | Laravel Like
description: Learn how to filter and sort your content based on interaction counts (likes, dislikes, loves) using the Laravel Like package.
keywords: ['laravel like', 'filter by likes', 'sort by popularity', 'interaction counts', 'query scopes', 'filtering']
tags: ['Filtering', 'Sorting', 'Interactions', 'Query Scopes', 'Tutorial']
---

# Filtering by Interaction Counts

This guide explains how to filter and sort your content based on interaction counts using the Laravel Like package. You'll learn how to find popular content, filter by thresholds, and create re-usable custom queries.

## Prerequisites

- [Installation](../getting-started/installation.md) completed
- `HasLike` / `HasLove` trait on your content model

## Filtering by minimum likes

```php
// Posts with at least 10 likes
$popular = Post::whereHas('likesTo', '>=', 10)->get();

// Posts with at least 50 likes AND at most 2 dislikes
$highQuality = Post::query()
    ->whereHas('likesTo', '>=', 50)
    ->whereHas('dislikesTo', '<=', 2)
    ->get();
```

## Filtering by ratio

```php
// Posts where likes are ≥ 80% of total interactions
$highQuality = Post::query()
    ->withCount(['likesTo as likes_count', 'dislikesTo as dislikes_count'])
    ->havingRaw('likes_count / (likes_count + dislikes_count) >= 0.8')
    ->get();
```

## Sorting by popularity

```php
// Posts sorted by like count (descending)
$posts = Post::query()
    ->withCount('likesTo as likes_count')
    ->orderByDesc('likes_count')
    ->paginate(15);

// Combined sorting — likes desc, then dislikes asc
$posts = Post::query()
    ->withCount([
        'likesTo as likes_count',
        'dislikesTo as dislikes_count',
        'lovesTo as loves_count',  // requires HasLove
    ])
    ->orderByDesc('likes_count')
    ->orderBy('dislikes_count')
    ->orderByDesc('loves_count')
    ->paginate(15);
```

## Re-usable scopes

Wrap these queries into local scopes on your model:

```php
class Post extends Model
{
    use HasLike, HasLove;

    public function scopePopular($query, int $minLikes = 10, int $maxDislikes = 2)
    {
        return $query->whereHas('likesTo', '>=', $minLikes)
            ->whereHas('dislikesTo', '<=', $maxDislikes)
            ->withCount('likesTo as likes_count')
            ->orderByDesc('likes_count');
    }

    public function scopeMostTrending($query, int $hours = 24, int $min = 5)
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

```php
$popularPosts  = Post::popular()->get();
$weeklyTrends  = Post::mostTrending(168, 20)->take(10)->get();
```

## Real-world examples

### Most popular this week

```php
$weeklyPopular = Post::whereHas('likesTo', function ($q) {
    $q->where('created_at', '>=', now()->subWeek());
})
->withCount(['likesTo as weekly_likes' => function ($q) {
    $q->where('created_at', '>=', now()->subWeek());
}])
->orderByDesc('weekly_likes')
->take(5)
->get();
```

### Controversial content

```php
$controversial = Post::query()
    ->withCount(['likesTo as likes_count', 'dislikesTo as dislikes_count'])
    ->having('likes_count', '>', 5)
    ->having('dislikes_count', '>', 5)
    ->orderByRaw('ABS(likes_count - dislikes_count)')
    ->get();
```

## Performance optimization

### Indexes

Add explicit indexes if your dataset grows large:

```php
public function up(): void
{
    Schema::table('likes', function (Blueprint $table) {
        $table->index(['model_type', 'model_id', 'type']);
        $table->index(['user_id', 'type']);
    });
}
```

### Cache hot queries

```php
use Illuminate\Support\Facades\Cache;

function getPopularPosts(int $limit = 10)
{
    return Cache::remember('popular_posts_' . $limit, 1800, function () use ($limit) {
        return Post::query()
            ->withCount('likesTo as likes_count')
            ->orderByDesc('likes_count')
            ->limit($limit)
            ->get();
    });
}
```

## Common pitfalls

1. **N+1 queries** — always use `withCount()` (never `$post->likesCount()` in a loop).
2. **Relation names** — there are no `dislikes` / `loves` relationship methods. Use `dislikesTo` / `lovesTo` (or the generic `likes`) with `withCount`/`whereHas`.
3. **`having` with `withCount`** — `having()` only works on aggregated columns; when grouping, wrap raw expressions in `havingRaw()`.
4. **Pagination** — always paginate potentially large datasets.

## Next Steps

- [Query scopes](query_scopes.md) — query-building building blocks
- [Counting interactions](counting_interactions.md) — aggregation recipes
- [Performance](performance.md) — broader optimisation guide