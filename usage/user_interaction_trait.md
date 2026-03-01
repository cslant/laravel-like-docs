---
title: User Interaction Trait | Laravel Like
description: Learn how to use the UserHasInteraction trait in your User model to track and manage user interactions with the Laravel Like package.
keywords: ['laravel like', 'user interaction', 'UserHasInteraction', 'user trait', 'user likes', 'track interactions']
tags: ['User Trait', 'Interactions', 'User Model', 'Tutorial', 'Usage']
---

# User Interaction Trait

The `UserHasInteraction` trait allows your **User model** to track and manage all interactions (likes, dislikes, loves) that a user has made. This is different from the `HasLike` trait, which is used on **content models** (Post, Article, etc.).

## Prerequisites

- Laravel 9.0 or higher
- PHP 8.1 or higher
- Laravel Like package installed and configured
- User authentication set up

## Setting Up the User Model

Add the `UserHasInteraction` trait to your User model:

```php
use CSlant\LaravelLike\UserHasInteraction;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use UserHasInteraction;

    // Your model code...
}
```

## Available Methods

### Get All User Interactions

The `likes()` method returns a `HasMany` relationship for all interactions made by the user:

```php
$user = User::find(1);

// Get all interactions (likes, dislikes, loves) by this user
$allInteractions = $user->likes()->get();

// Get only likes
$userLikes = $user->likes()->where('type', 'like')->get();

// Get only dislikes
$userDislikes = $user->likes()->where('type', 'dislike')->get();

// Get only loves
$userLoves = $user->likes()->where('type', 'love')->get();
```

### Using with Eager Loading

You can eager load user interactions to avoid N+1 queries:

```php
// Load users with their interactions
$users = User::with('likes')->get();

// Count interactions per user
$users = User::withCount('likes')->get();

foreach ($users as $user) {
    echo "{$user->name} has {$user->likes_count} interactions";
}
```

### Forget User Interactions

Remove all interactions or interactions of a specific type for a user:

```php
$user = User::find(1);

// Remove all interactions by this user
$user->forgetInteractions();

// Remove only likes by this user
$user->forgetInteractions('like');

// Remove only dislikes by this user
$user->forgetInteractions('dislike');

// Remove only loves by this user
$user->forgetInteractions('love');
```

You can also use the `forgetInteractionsOfType()` method directly:

```php
// Remove all likes by this user
$user->forgetInteractionsOfType('like');
```

## Practical Examples

### User Profile: Show Liked Content

```php
// In your controller
public function profile(User $user)
{
    $likedPosts = $user->likes()
        ->where('type', 'like')
        ->where('model_type', Post::class)
        ->with('model') // Eager load the related content
        ->latest()
        ->paginate(10);

    return view('profile', compact('user', 'likedPosts'));
}
```

### User Activity Feed

```php
// Get recent interactions by the user
$recentActivity = $user->likes()
    ->with('model')
    ->latest()
    ->take(20)
    ->get()
    ->map(function ($interaction) {
        return [
            'type' => $interaction->type->value,
            'content' => $interaction->model,
            'date' => $interaction->created_at->diffForHumans(),
        ];
    });
```

### Count Interactions by Type

```php
$user = User::find(1);

$stats = [
    'total_likes' => $user->likes()->where('type', 'like')->count(),
    'total_dislikes' => $user->likes()->where('type', 'dislike')->count(),
    'total_loves' => $user->likes()->where('type', 'love')->count(),
];
```

## Configuration

The trait uses configuration values from `config/like.php`:

```php
'users' => [
    'model' => 'App\Models\User',      // Your User model class
    'foreign_key' => 'user_id',          // Foreign key in the likes table
],
```

If you use a custom user model or a different foreign key, update these values accordingly.

## Next Steps

- Learn about [Customizing User Interaction](customizing_user_interaction.md)
- Check out [Liking Content](liking_content.md) to set up content models
- Explore [Counting Interactions](counting_interactions.md) for analytics

