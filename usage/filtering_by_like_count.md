---
title: Filtering by Interaction Counts | Laravel Like
description: Learn how to filter and sort your content based on interaction counts (likes, dislikes, loves) using the Laravel Like package.
keywords: ['laravel like', 'filter by likes', 'sort by popularity', 'interaction counts', 'query scopes', 'filtering']
tags: ['Filtering', 'Sorting', 'Interactions', 'Query Scopes', 'Tutorial']
---

# Filtering by Interaction Counts

This guide explains how to filter and sort your content based on interaction counts using the Laravel Like package. You'll learn how to find popular content, filter by specific interaction thresholds, and create custom queries.

## Prerequisites

- Laravel 9.0 or higher
- PHP 8.1 or higher
- Laravel Like package installed and configured
- Models set up with the `HasLike` trait

## Basic Filtering

### Get Content with Minimum Likes

```php
// Get posts with at least 10 likes
$popularPosts = Post::whereHas('likes', function($query) {
    $query->where('type', 'like');
}, '>=', 10)->get();

// Using the provided scope
$popularPosts = Post::has('likes', '>=', 10)->get();
```

### Get Content with No Dislikes

```php
// Get posts with no dislikes
$nonControversial = Post::whereDoesntHave('dislikes')->get();
```

## Advanced Filtering

### Filter by Multiple Interaction Types

```php
// Get posts with many likes AND few dislikes
$highQualityPosts = Post::whereHas('likes', function($q) {
    $q->where('type', 'like');
}, '>=', 10)
->whereHas('dislikes', function($q) {
    $q->where('type', 'dislike');
}, '<=', 2)
->get();
```

### Filter by Interaction Ratio

```php
// Get posts where likes are at least 80% of total interactions
$highQualityPosts = Post::withCount(['likes', 'dislikes'])
    ->havingRaw('likes_count / (likes_count + dislikes_count) >= 0.8')
    ->get();
```

## Sorting by Popularity

### Basic Sorting

```php
// Sort by number of likes (descending)
$posts = Post::withCount('likes')
    ->orderBy('likes_count', 'desc')
    ->get();

// Sort by interaction score (likes - dislikes)
$posts = Post::withCount(['likes', 'dislikes'])
    ->orderByRaw('(SELECT COUNT(*) FROM likes WHERE likes.model_id = posts.id AND likes.type = ?) - (SELECT COUNT(*) FROM likes WHERE likes.model_id = posts.id AND likes.type = ?) DESC', 
        ['like', 'dislike'])
    ->get();
```

### Sorting with Eager Loading

```php
// Eager load counts and sort
$posts = Post::withCount(['likes', 'dislikes', 'loves'])
    ->orderBy('likes_count', 'desc')
    ->orderBy('loves_count', 'desc')
    ->orderBy('dislikes_count', 'asc')
    ->paginate(15);
```

## Custom Query Scopes

### Create a Popular Scope

In your model:

```php
public function scopePopular($query, $minLikes = 10, $maxDislikes = 2)
{
    return $query->withCount(['likes', 'dislikes'])
        ->having('likes_count', '>=', $minLikes)
        ->having('dislikes_count', '<=', $maxDislikes)
        ->orderBy('likes_count', 'desc');
}

// Usage
$popularPosts = Post::popular()->get();
```

### Create a Trending Scope

```php
public function scopeTrending($query, $hours = 24, $minInteractions = 5)
{
    $cutoff = now()->subHours($hours);
    
    return $query->whereHas('interactions', function($q) use ($cutoff) {
        $q->where('created_at', '>=', $cutoff);
    }, '>=', $minInteractions)
    ->withCount(['interactions as recent_interactions_count' => function($q) use ($cutoff) {
        $q->where('created_at', '>=', $cutoff);
    }])
    ->orderBy('recent_interactions_count', 'desc');
}

// Usage
$trendingPosts = Post::trending(48, 10)->get(); // Last 48 hours, min 10 interactions
```

## Performance Optimization

### Add Database Indexes

Add this to a migration:

```php
// Add index for faster filtering
Schema::table('likes', function (Blueprint $table) {
    $table->index(['model_type', 'model_id', 'type']);
    $table->index(['user_id', 'type']);
});
```

### Cache Popular Queries

```php
use Illuminate\Support\Facades\Cache;

function getPopularPosts($limit = 10)
{
    $cacheKey = 'popular_posts_' . $limit;
    $minutes = 30; // Cache for 30 minutes
    
    return Cache::remember($cacheKey, $minutes, function () use ($limit) {
        return Post::withCount('likes')
            ->orderBy('likes_count', 'desc')
            ->limit($limit)
            ->get();
    });
}

// In your controller
$popularPosts = getPopularPosts(10);
```

## Real-world Examples

### Most Popular This Week

```php
// Get most liked posts from the last 7 days
$weeklyPopular = Post::whereHas('likes', function($q) {
    $q->where('created_at', '>=', now()->subWeek());
})
->withCount(['likes as weekly_likes' => function($q) {
    $q->where('created_at', '>=', now()->subWeek());
}])
->orderBy('weekly_likes', 'desc')
->take(5)
->get();
```

### Controversial Content

```php
// Get posts with many likes AND dislikes
$controversial = Post::withCount(['likes', 'dislikes'])
    ->having('likes_count', '>', 5)
    ->having('dislikes_count', '>', 5)
    ->orderByRaw('ABS(likes_count - dislikes_count)') // Closest to equal
    ->get();
```

## Common Pitfalls

1. **N+1 Queries**: Always use `withCount()` to avoid N+1 query problems
2. **Missing Indexes**: Ensure proper database indexes for performance
3. **Cache Invalidation**: Remember to clear cache when interactions change
4. **Pagination**: Always use pagination for potentially large result sets

## Next Steps

- Learn about [customizing interactions](customizing_user_interaction.md)
- Explore [query scopes](query_scopes.md) for more advanced filtering
- Check out [counting interactions](counting_interactions.md) for more statistics

For more advanced usage, refer to the [GitHub Repository](https://github.com/cslant/laravel-like).
