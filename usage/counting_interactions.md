---
title: Counting Interactions | Laravel Like
description: Learn how to count and aggregate interactions (likes, dislikes, loves) in your Laravel application using the Laravel Like package.
keywords: ['laravel like', 'count interactions', 'like count', 'dislike count', 'love count', 'interaction statistics']
tags: ['Interactions', 'Counting', 'Statistics', 'Aggregation', 'Tutorial']
---

# Counting Interactions

This guide explains how to count and aggregate interactions (likes, dislikes, and loves) on your Eloquent models using the Laravel Like package.

## Prerequisites

- Laravel 9.0 or higher
- PHP 8.1 or higher
- Laravel Like package installed and configured
- Models set up with the `HasLike` trait

## Basic Interaction Counts

### Get Count for a Single Model

```php
$post = Post::find(1);

// Get like count
$likeCount = $post->likeCount; // Using magic property
// or
$likeCount = $post->getLikeCount(); // Using method

// Get dislike count
$dislikeCount = $post->dislikeCount;
$dislikeCount = $post->getDislikeCount();

// Get love count
$loveCount = $post->loveCount;
$loveCount = $post->getLoveCount();

// Get all interaction counts as an array
$counts = $post->interactionCounts;
// Returns: ['like' => 5, 'dislike' => 2, 'love' => 3]
```

### Get Count for Multiple Models

When working with multiple models, use eager loading for better performance:

```php
// Eager load counts for multiple posts
$posts = Post::withCount(['likes', 'dislikes', 'loves'])->get();

foreach ($posts as $post) {
    echo "Post ID: {$post->id}\n";
    echo "Likes: {$post->likes_count}\n";
    echo "Dislikes: {$post->dislikes_count}\n";
    echo "Loves: {$post->loves_count}\n\n";
}
```

## Advanced Counting

### Count Interactions by Type

```php
use CSlant\LaravelLike\Enums\InteractionTypeEnum;

// Count all likes for a model
$likeCount = $post->interactions()
    ->where('type', InteractionTypeEnum::LIKE->value)
    ->count();

// Count interactions by multiple types
$positiveInteractions = $post->interactions()
    ->whereIn('type', [
        InteractionTypeEnum::LIKE->value,
        InteractionTypeEnum::LOVE->value
    ])
    ->count();
```

### Count User Interactions

```php
// Count how many items a user has liked
$userLikes = Like::where('user_id', $user->id)
    ->where('type', 'like')
    ->count();

// Count how many items a user has interacted with (all types)
$totalInteractions = $user->interactions()->count();
```

## Aggregating Data

### Get Most Liked Content

```php
// Get top 5 most liked posts
$mostLiked = Post::withCount('likes')
    ->orderBy('likes_count', 'desc')
    ->take(5)
    ->get();
```

### Get Interaction Statistics

```php
// Get interaction statistics for a model
$stats = [
    'total_likes' => $post->likes()->count(),
    'total_dislikes' => $post->dislikes()->count(),
    'total_loves' => $post->loves()->count(),
    'interaction_score' => $post->likes()->count() - $post->dislikes()->count(),
];
```

### Group Interactions by Type

```php
// Group interactions by type
$interactionTypes = $post->interactions()
    ->select('type', \DB::raw('count(*) as total'))
    ->groupBy('type')
    ->pluck('total', 'type');

// Example output: ['like' => 5, 'dislike' => 2, 'love' => 3]
```

## Performance Optimization

### Cache Interaction Counts

For frequently accessed counts, consider caching the results:

```php
use Illuminate\Support\Facades\Cache;

function getLikeCount($postId)
{
    $cacheKey = "post_{$postId}_like_count";
    $minutes = 60; // Cache for 1 hour
    
    return Cache::remember($cacheKey, $minutes, function () use ($postId) {
        return Post::find($postId)->likes()->count();
    });
}

// Invalidate cache when interactions change
Cache::forget("post_{$postId}_like_count");
```

### Batch Counting

For counting across multiple models, use the query builder:

```php
// Get like counts for multiple posts at once
$postIds = [1, 2, 3, 4, 5];
$likeCounts = \DB::table('likes')
    ->select('model_id', \DB::raw('count(*) as total'))
    ->where('model_type', Post::class)
    ->whereIn('model_id', $postIds)
    ->where('type', 'like')
    ->groupBy('model_id')
    ->pluck('total', 'model_id');
```

## Common Use Cases

### Displaying Interaction Counts

In your Blade views:

```blade
<div class="interactions">
    <span class="likes">
        <i class="fa fa-thumbs-up"></i>
        <span>{{ $post->likes_count }} Likes</span>
    </span>
    
    <span class="dislikes">
        <i class="fa fa-thumbs-down"></i>
        <span>{{ $post->dislikes_count }}</span>
    </span>
    
    <span class="loves">
        <i class="fa fa-heart"></i>
        <span>{{ $post->loves_count }}</span>
    </span>
</div>
```

### Sorting by Popularity

```php
// Get posts sorted by interaction score (likes - dislikes)
$popularPosts = Post::withCount(['likes', 'dislikes'])
    ->selectRaw('posts.*, (SELECT COUNT(*) FROM likes WHERE likes.model_id = posts.id AND likes.type = ?) - (SELECT COUNT(*) FROM likes WHERE likes.model_id = posts.id AND likes.type = ?) as interaction_score', 
        ['like', 'dislike'])
    ->orderBy('interaction_score', 'desc')
    ->get();
```

## Performance Considerations

1. **Indexing**: Ensure you have proper database indexes on:
   - `model_id` and `model_type` for polymorphic relationships
   - `user_id` for user lookups
   - `type` for filtering by interaction type

2. **Eager Loading**: Always use eager loading when working with multiple models

3. **Selective Counting**: Only count what you need, especially in loops

4. **Pagination**: For large datasets, always use pagination

## Troubleshooting

### Common Issues

1. **Slow Queries**: Check your database indexes and query execution plans
2. **Incorrect Counts**: Clear your cache if using caching
3. **Missing Data**: Verify your model is using the `HasLike` trait

## Next Steps

- Learn how to [filter by interaction counts](filtering_by_like_count.md)
- Explore [advanced query scopes](query_scopes.md)
- Discover how to [customize interactions](customizing_user_interaction.md)

For more advanced usage, refer to the [GitHub Repository](https://github.com/cslant/laravel-like).
