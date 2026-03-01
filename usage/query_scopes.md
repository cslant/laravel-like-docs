---
title: Query Scopes | Laravel Like
description: Learn how to use and create powerful query scopes with the Laravel Like package to filter and sort your content based on interactions.
keywords: ['laravel like', 'query scopes', 'filtering', 'sorting', 'eloquent', 'database queries']
tags: ['Query Scopes', 'Filtering', 'Sorting', 'Eloquent', 'Performance', 'Tutorial']
---

# Query Scopes with Laravel Like

This guide covers how to use and create custom query scopes with the Laravel Like package to build powerful and efficient queries for your interactive content.

## Prerequisites

- Laravel 9.0 or higher
- PHP 8.1 or higher
- Laravel Like package installed and configured
- Models set up with the `HasLike` trait

## Built-in Scopes

The Laravel Like package comes with several useful query scopes out of the box.

### Filtering by Interaction

```php
// Get posts liked by a specific user
$userLikedPosts = Post::whereLikedBy($userId)->get();

// Get posts disliked by a specific user
$userDislikedPosts = Post::whereDislikedBy($userId)->get();

// Get posts loved by a specific user
$userLovedPosts = Post::whereLovedBy($userId)->get();

// Get posts with a specific interaction type
$likedPosts = Post::whereHasInteraction('like')->get();
$dislikedPosts = Post::whereHasInteraction('dislike')->get();
$lovedPosts = Post::whereHasInteraction('love')->get();

// Get posts with any interaction
$interactedPosts = Post::whereHasAnyInteraction()->get();

// Get posts with no interactions
$uninteractedPosts = Post::whereDoesntHaveAnyInteraction()->get();
```

### Sorting by Interaction Counts

```php
// Order by number of likes (descending)
$posts = Post::orderByLikesCount('desc')->get();

// Order by number of dislikes (ascending)
$posts = Post::orderByDislikesCount('asc')->get();

// Order by number of loves (descending)
$posts = Post::orderByLovesCount('desc')->get();

// Order by interaction score (likes - dislikes)
$posts = Post::orderByInteractionScore('desc')->get();
```

## Creating Custom Scopes

### Basic Interaction Scope

```php
// In your Post model
public function scopePopular($query, $minLikes = 10)
{
    return $query->withCount('likes')
        ->having('likes_count', '>=', $minLikes)
        ->orderBy('likes_count', 'desc');
}

// Usage
$popularPosts = Post::popular(20)->get(); // Posts with at least 20 likes
```

### Time-based Interaction Scope

```php
public function scopeTrending($query, $hours = 24, $minInteractions = 5)
{
    $cutoff = now()->subHours($hours);
    
    return $query->whereHas('interactions', function($q) use ($cutoff) {
        $q->where('created_at', '>=', $cutoff);
    }, '>=', $minInteractions)
    ->withCount(['interactions as recent_interactions' => function($q) use ($cutoff) {
        $q->where('created_at', '>=', $cutoff);
    }])
    ->orderBy('recent_interactions', 'desc');
}

// Usage
$trendingPosts = Post::trending(48, 10)->get(); // Last 48 hours, min 10 interactions
```

### Interaction Ratio Scope

```php
public function scopeHighQuality($query, $minRatio = 0.8, $minInteractions = 5)
{
    return $query->withCount(['likes', 'dislikes'])
        ->havingRaw('likes_count >= ?', [$minInteractions])
        ->havingRaw('likes_count / (likes_count + COALESCE(dislikes_count, 0)) >= ?', [$minRatio])
        ->orderByRaw('likes_count / (likes_count + COALESCE(dislikes_count, 0)) DESC');
}

// Usage
$highQualityPosts = Post::highQuality(0.9, 10)->get(); // 90%+ like ratio, min 10 likes
```

## Combining Scopes

You can chain multiple scopes together for more complex queries:

```php
// Get popular, high-quality posts from the last week
$posts = Post::popular(50)
    ->highQuality(0.85, 20)
    ->where('created_at', '>=', now()->subWeek())
    ->orderBy('created_at', 'desc')
    ->paginate(15);
```

## Performance Considerations

### Eager Loading

Always eager load relationships to avoid N+1 query problems:

```php
// Good: Uses eager loading
$posts = Post::withCount(['likes', 'dislikes', 'loves'])
    ->popular()
    ->get();

// Bad: Causes N+1 queries
$posts = Post::popular()->get();
foreach ($posts as $post) {
    echo $post->likes_count; // This would cause an additional query per post
}
```

### Database Indexing

Ensure your database is properly indexed. Add these to a migration:

```php
public function up()
{
    Schema::table('likes', function (Blueprint $table) {
        // For filtering by model
        $table->index(['model_type', 'model_id', 'type']);
        
        // For finding user interactions
        $table->index(['user_id', 'type']);
        
        // For time-based queries
        $table->index('created_at');
    });
}
```

### Caching Expensive Queries

Cache the results of expensive queries:

```php
use Illuminate\Support\Facades\Cache;

public function getTopPosts($limit = 10)
{
    $cacheKey = 'top_posts_' . $limit;
    $minutes = 30; // Cache for 30 minutes
    
    return Cache::remember($cacheKey, $minutes, function () use ($limit) {
        return Post::withCount(['likes', 'comments'])
            ->orderByInteractionScore('desc')
            ->limit($limit)
            ->get();
    });
}

// In your controller
$topPosts = $this->getTopPosts(10);
```

## Real-world Examples

### Most Controversial Content

```php
public function scopeControversial($query, $minInteractions = 10)
{
    return $query->withCount(['likes', 'dislikes'])
        ->havingRaw('(likes_count + dislikes_count) >= ?', [$minInteractions])
        ->orderByRaw('ABS(likes_count - dislikes_count)') // Closest to equal
        ->orderByRaw('(likes_count + dislikes_count) DESC'); // Most interactions first
}

// Usage
$controversialPosts = Post::controversial(20)->get();
```

### Recently Popular Content

```php
public function scopeRecentlyPopular($query, $days = 7, $minLikes = 10)
{
    $cutoff = now()->subDays($days);
    
    return $query->whereHas('likes', function($q) use ($cutoff) {
        $q->where('created_at', '>=', $cutoff);
    }, '>=', $minLikes)
    ->withCount(['likes as recent_likes' => function($q) use ($cutoff) {
        $q->where('created_at', '>=', $cutoff);
    }])
    ->orderBy('recent_likes', 'desc');
}

// Usage
$recentlyPopular = Post::recentlyPopular(14, 25)->get(); // Last 14 days, min 25 likes
```

## Testing Your Scopes

Create tests to ensure your scopes work as expected:

```php
// tests/Feature/PostScopesTest.php
public function test_popular_scope()
{
    // Create posts with different like counts
    $unpopularPost = Post::factory()->create();
    $popularPost = Post::factory()->hasLikes(15)->create();
    
    // Test the scope
    $results = Post::popular(10)->get();
    
    $this->assertCount(1, $results);
    $this->assertTrue($results->contains('id', $popularPost->id));
    $this->assertFalse($results->contains('id', $unpopularPost->id));
}
```

## Common Pitfalls

1. **N+1 Queries**: Always use `withCount()` when you need counts
2. **Missing Indexes**: Ensure proper database indexes for performance
3. **Complex Queries**: Break down complex queries into smaller scopes
4. **Caching**: Cache expensive queries when appropriate

## Next Steps

- Learn about [customizing interactions](customizing_user_interaction.md)
- Check out [filtering by interaction counts](filtering_by_like_count.md)
- Explore [counting interactions](counting_interactions.md) for more statistics

For more advanced usage, refer to the [GitHub Repository](https://github.com/cslant/laravel-like).
