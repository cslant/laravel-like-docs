---
title: User Interaction Trait | Laravel Like
description: Learn how to use the UserHasInteraction trait in your User model to track and manage user interactions with the Laravel Like package.
keywords: ['laravel like', 'user interaction', 'UserHasInteraction', 'user trait', 'user likes', 'track interactions', 'userHasInteraction']
tags: ['User Trait', 'Interactions', 'User Model', 'Tutorial', 'Usage']
---

# User Interaction Trait

The `UserHasInteraction` trait allows your **User model** to track and manage all interactions (likes, dislikes, loves) that a user has made. This is different from the `HasLike` trait, which is used on **content models** (Post, Article, Video, etc.).

| Trait | Model | Relationship |
| --- | --- | --- |
| `HasLike` / `HasLove` | Content model (Post, Article, Video) | `likes()` — `MorphMany` (the content has interactions) |
| `UserHasInteraction` | **User** model | `likes()` — `HasMany` (the user owns interactions) |

## Prerequisites

- [Installation](../getting-started/installation.md) completed
- User authentication set up
- A content model with the `HasLike` / `HasLove` trait

## Setting Up the User Model

Add the `UserHasInteraction` trait to your User model:

```php
namespace App\Models;

use CSlant\LaravelLike\UserHasInteraction;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use UserHasInteraction;

    // Your model code...
}
```

## Available methods

The trait provides a `likes()` **HasMany** relationship plus bulk-removal helpers:

| Method | Returns | Description |
| --- | --- | --- |
| `likes()` | `HasMany` | All the user's interaction records |
| `forgetInteractions(?string $type)` | `static` ($this) | Delete all (or one type of) the user's interactions |
| `forgetInteractionsOfType(string $type)` | `static` ($this) | Delete a specific interaction type |

## Get all user interactions

```php
$user = User::find(1);

// All interactions (likes, dislikes, loves) by this user
$allInteractions = $user->likes()->get();

// Filter by type
$userLikes    = $user->likes()->where('type', 'like')->get();
$userDislikes = $user->likes()->where('type', 'dislike')->get();
$userLoves    = $user->likes()->where('type', 'love')->get();

// Filter by content type
$postsLiked = $user->likes()
    ->where('model_type', Post::class)
    ->where('type', 'like')
    ->with('model') // eager load the liked content
    ->get();
```

## Count interactions per user

```php
// Count of all the user's interactions
$total = $user->likes()->count();

// Count per type
$likesCount    = $user->likes()->where('type', 'like')->count();
$dislikesCount = $user->likes()->where('type', 'dislike')->count();
$lovesCount    = $user->likes()->where('type', 'love')->count();
```

## Eager loading

Avoid N+1 queries when working with multiple users by eager loading:

```php
// Users with their interactions
$users = User::with('likes')->get();

// Users with interaction counts
$users = User::withCount('likes')->get();

foreach ($users as $user) {
    echo "{$user->name} has {$user->likes_count} interactions";
}
```

## Forget user interactions

```php
$user = User::find(1);

// Remove all interactions by this user
$user->forgetInteractions();

// Remove only likes by this user
$user->forgetInteractions('like');

// Remove only dislikes
$user->forgetInteractions('dislike');

// Remove only loves
$user->forgetInteractions('love');

// Or use the typed method directly
$user->forgetInteractionsOfType('like');
```

:::tip Chainable

`forgetInteractions()` and `forgetInteractionsOfType()` return the model, so you can chain:

```php
$countAfter = $user->forgetInteractions('like')->likes()->count();
```

:::

## Practical example: user profile page

```php
public function profile(User $user)
{
    // A user's liked posts (eager-loaded content)
    $likedPosts = $user->likes()
        ->where('type', 'like')
        ->where('model_type', Post::class)
        ->with('model')
        ->latest()
        ->paginate(10);

    return view('profile', compact('user', 'likedPosts'));
}
```

### User activity feed

```php
$recentActivity = $user->likes()
    ->with('model')
    ->latest()
    ->take(20)
    ->get()
    ->map(fn ($interaction) => [
        'type'    => $interaction->type->value,
        'content' => $interaction->model,
        'date'    => $interaction->created_at->diffForHumans(),
    ]);
```

## Configuration

The `likes()` relationship is built from `config/like.php`:

```php
'users' => [
    'model' => null,             // null = falls back to auth provider model
    'foreign_key' => 'user_id',  // Foreign key in the likes table
],
```

If you use a custom user model or a different foreign key, update the configuration so the relationship resolves to the correct table/columns.

## Next Steps

- [Customizing User Interaction](customizing_user_interaction.md) — custom models and extended behaviour
- [Liking content](liking_content.md) — set up content models
- [Counting interactions](counting_interactions.md) — analytics across models