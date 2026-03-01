---
title: Unliking Content | Laravel Like
description: Learn how to remove interactions (unlike, undislike, unlove) from content in your Laravel application using the Laravel Like package.
keywords: ['laravel like', 'unlike', 'remove like', 'remove dislike', 'remove interaction', 'undo interaction']
tags: ['Basic Usage', 'Unlike', 'Remove Interactions', 'Tutorial']
---

# Unliking and Removing Interactions

This guide explains how to remove interactions from your content using the Laravel Like package. You can remove specific interactions by user, remove all interactions of a certain type, or clear all interactions entirely.

## Prerequisites

- Laravel 9.0 or higher
- PHP 8.1 or higher
- Laravel Like package installed and configured
- Models set up with the `HasLike` trait (see [Liking Content](liking_content.md))

## Removing Interactions from Content Models

The `HasLike` trait (via `InteractionRelationship`) provides methods to remove interactions directly from your content models.

### Remove All Interactions

Use `forgetInteractions()` to remove all interactions from a model:

```php
$post = Post::find(1);

// Remove ALL interactions (likes, dislikes, loves) from this post
$post->forgetInteractions();
```

### Remove Interactions by Type

Use `forgetInteractionsOfType()` or pass a type to `forgetInteractions()` to remove only specific interaction types:

```php
$post = Post::find(1);

// Remove only likes from this post
$post->forgetInteractions('like');

// Remove only dislikes from this post
$post->forgetInteractions('dislike');

// Remove only loves from this post
$post->forgetInteractions('love');

// Or use forgetInteractionsOfType() directly
$post->forgetInteractionsOfType('like');
```

### Remove a Specific User's Interaction

To remove a specific user's interaction from a content model:

```php
$post = Post::find(1);
$userId = auth()->id();

// Remove a specific user's interaction (all types)
$post->likes()->where('user_id', $userId)->delete();

// Remove only a specific user's like
$post->likes()
    ->where('user_id', $userId)
    ->where('type', 'like')
    ->delete();

// Remove only a specific user's dislike
$post->likes()
    ->where('user_id', $userId)
    ->where('type', 'dislike')
    ->delete();
```

## Removing Interactions from User Models

If your User model uses the `UserHasInteraction` trait, you can also remove interactions from the user side:

```php
$user = User::find(1);

// Remove all interactions by this user
$user->forgetInteractions();

// Remove only likes by this user
$user->forgetInteractions('like');

// Remove a user's interaction on a specific post
$user->likes()
    ->where('model_type', Post::class)
    ->where('model_id', $postId)
    ->delete();
```

## Toggle Interaction

The `Like` model provides a `toggleLikeInteraction()` method to toggle between like and dislike:

```php
use CSlant\LaravelLike\Models\Like;

$interaction = Like::where('user_id', $userId)
    ->where('model_type', Post::class)
    ->where('model_id', $postId)
    ->first();

if ($interaction) {
    // Toggle: if liked → dislike, if disliked → like
    $newType = $interaction->toggleLikeInteraction();
    $interaction->save();

    echo "Interaction changed to: {$newType}";
}
```

## Practical Examples

### Unlike Button in Controller

```php
use CSlant\LaravelLike\Models\Like;

class PostInteractionController extends Controller
{
    /**
     * Remove the user's interaction from a post.
     */
    public function unlike(Post $post)
    {
        $userId = auth()->id();

        $deleted = $post->likes()
            ->where('user_id', $userId)
            ->delete();

        if ($deleted) {
            return response()->json([
                'message' => 'Interaction removed successfully',
                'likes_count' => $post->likesCount(),
            ]);
        }

        return response()->json([
            'message' => 'No interaction found',
        ], 404);
    }

    /**
     * Toggle the user's like on a post.
     */
    public function toggle(Post $post)
    {
        $userId = auth()->id();

        $existing = $post->likes()
            ->where('user_id', $userId)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json([
                'status' => 'removed',
                'likes_count' => $post->fresh()->likesCount(),
            ]);
        }

        $post->likes()->create([
            'user_id' => $userId,
            'type' => 'like',
        ]);

        return response()->json([
            'status' => 'liked',
            'likes_count' => $post->fresh()->likesCount(),
        ]);
    }
}
```

### Bulk Remove Interactions

```php
// Remove all interactions older than 30 days
$post = Post::find(1);
$post->likes()
    ->where('created_at', '<', now()->subDays(30))
    ->delete();

// Remove all interactions from a list of users
$userIds = [1, 2, 3];
$post->likes()
    ->whereIn('user_id', $userIds)
    ->delete();
```

### Check Before Removing

```php
$post = Post::find(1);
$userId = auth()->id();

// Check if user has interacted before removing
if ($post->isInteractedBy($userId)) {
    $post->likes()->where('user_id', $userId)->delete();
    echo "Interaction removed!";
} else {
    echo "No interaction to remove.";
}

// Check specific type
if ($post->isLikedBy($userId)) {
    $post->likes()
        ->where('user_id', $userId)
        ->where('type', 'like')
        ->delete();
}
```

## Method Chaining

The `forgetInteractions()` and `forgetInteractionsOfType()` methods return the model instance, so you can chain:

```php
$post = Post::find(1);

// Remove all likes, then get updated count
$likesRemaining = $post->forgetInteractionsOfType('like')->likesCount();

echo "Likes remaining: {$likesRemaining}";
```

## Next Steps

- Learn about [Liking Content](liking_content.md) to add interactions
- Check out [Check if Interacted](check_if_interacted.md) to verify status
- Explore [Counting Interactions](counting_interactions.md) for analytics
