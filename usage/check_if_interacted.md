---
title: Checking Interactions | Laravel Like
description: Learn how to check if users have interacted with content in your Laravel application using the Laravel Like package.
keywords: ['laravel like', 'check interactions', 'verify likes', 'check dislikes', 'check loves', 'interaction status']
tags: ['Interactions', 'Checking', 'Verification', 'Status', 'Tutorial']
---

# Checking Interactions

This guide explains how to check if users have interacted with your content using the Laravel Like package. You can verify likes, dislikes, and loves on your Eloquent models.

## Prerequisites

- Laravel 9.0 or higher
- PHP 8.1 or higher
- Laravel Like package installed and configured
- Models set up with the `HasLike` trait

## Basic Interaction Checks

### Check if Authenticated User Has Interacted

```php
$post = Post::find(1);

// Check if the current user has liked the post
if ($post->isLiked()) {
    // User has liked this post
}

// Check for other interaction types
if ($post->isDisliked()) {
    // User has disliked this post
}

if ($post->isLoved()) {
    // User has loved this post
}
```

### Check if a Specific User Has Interacted

```php
$user = User::find(1);
$post = Post::find(1);

// Check if a specific user has liked the post
if ($post->isLikedBy($user)) {
    // The specified user has liked this post
}

// Check for other interaction types
if ($post->isDislikedBy($user)) {
    // The specified user has disliked this post
}

if ($post->isLovedBy($user)) {
    // The specified user has loved this post
}
```

## Getting Interaction Status

### Get the Current User's Interaction Type

```php
$interactionType = $post->getInteractionType();
// Returns: 'like', 'dislike', 'love', or null

// Example usage
switch ($post->getInteractionType()) {
    case 'like':
        // Handle like
        break;
    case 'dislike':
        // Handle dislike
        break;
    case 'love':
        // Handle love
        break;
    default:
        // No interaction
}
```

### Get a Specific User's Interaction Type

```php
$user = User::find(1);
$interactionType = $post->getInteractionType($user);
// Returns: 'like', 'dislike', 'love', or null
```

## Checking Multiple Interactions

### Check if Any Interaction Exists

```php
// Check if the current user has any interaction with the post
if ($post->hasInteraction()) {
    // User has some interaction with this post
}

// Check if a specific user has any interaction
if ($post->hasInteraction($user)) {
    // The specified user has some interaction with this post
}
```

### Check for Specific Interactions

```php
// Check for multiple interaction types
if ($post->hasInteractions(['like', 'love'])) {
    // User has either liked or loved the post
}

// With a specific user
if ($post->hasInteractions(['like', 'love'], $user)) {
    // The specified user has either liked or loved the post
}
```

## Getting All User Interactions

### Get All Users Who Interacted

```php
// Get all users who liked the post
$likers = $post->likers;

// Get all users who disliked the post
$dislikers = $post->dislikers;

// Get all users who loved the post
$lovers = $post->lovers;
```

### Get Interaction Counts

```php
// Get like count
$likeCount = $post->likeCount;

// Get dislike count
$dislikeCount = $post->dislikeCount;

// Get love count
$loveCount = $post->loveCount;

// Get all interaction counts as an array
$counts = $post->interactionCounts;
// Returns: ['like' => 5, 'dislike' => 2, 'love' => 3]
```

## Advanced Usage

### Using Query Scopes

Filter models based on interactions:

```php
// Get all posts liked by the current user
$likedPosts = Post::whereLikedBy(auth()->id())->get();

// Get all posts disliked by a specific user
$dislikedPosts = Post::whereDislikedBy($user->id)->get();

// Get all posts loved by the current user
$lovedPosts = Post::whereLovedBy(auth()->id())->get();
```

### Eager Loading Interactions

For better performance when working with multiple models:

```php
// Eager load interaction counts
$posts = Post::withCount(['likes', 'dislikes', 'loves'])->get();

// Eager load user interactions
$posts = Post::with(['likes', 'dislikes', 'loves'])->get();

// Check interactions on each post
foreach ($posts as $post) {
    if ($post->isLiked()) {
        // Handle liked post
    }
    
    // Access counts
    $likeCount = $post->likes_count;
    $dislikeCount = $post->dislikes_count;
    $loveCount = $post->loves_count;
}
```

## Performance Considerations

1. **Eager Loading**: Always eager load relationships when working with multiple models
2. **Caching**: Consider caching interaction status for frequently accessed content
3. **Database Indexes**: Ensure proper indexing on the interactions table
4. **Batch Operations**: Use query builder for bulk operations

## Troubleshooting

### Common Issues

1. **Incorrect Results**: Clear your cache if interaction status seems incorrect
2. **Performance Issues**: Check your database indexes and queries
3. **Missing Data**: Ensure the user is authenticated or a user instance is provided

## Next Steps

- Learn how to [count interactions](counting_interactions.md)
- Explore [advanced query scopes](query_scopes.md)
- Discover how to [customize interactions](customizing_user_interaction.md)

For more advanced usage, refer to the [API documentation](../api/README.md).