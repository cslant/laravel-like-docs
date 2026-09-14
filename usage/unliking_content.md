---
title: Unliking Content | Laravel Like
description: Learn how to remove interactions (unlike, undislike, unlove) from content in your Laravel application using the Laravel Like package.
keywords: ['laravel like', 'unlike', 'remove like', 'remove dislike', 'remove interaction', 'unlove', 'undislike', 'forget interactions']
tags: ['Basic Usage', 'Unlike', 'Remove Interactions', 'Tutorial']
---

# Unliking and Removing Interactions

This guide explains how to remove interactions from your content using the Laravel Like package. You can remove specific interactions by type, clear all interactions on a model, or wipe a user's entire interaction history.

## Prerequisites

- [Installation](../getting-started/installation.md) completed
- `HasLike` / `HasLove` trait on your content model

## Remove interaction by type

### Unlike, undislike, unlove (single row)

These methods remove a single user's interaction of a specific type. They return `true` if a row was actually deleted, `false` if there was nothing to remove.

```php
$post = Post::find(1);
$userId = auth()->id();

$post->unlike();     // Removes the LIKE row  → returns bool
$post->unDislike();  // Removes the DISLIKE row → returns bool
$post->unlove();     // Removes the LOVE row   → returns bool
```

Explicit user id variant:

```php
$post->unlike($someOtherUserId);
```

From the facade:

```php
use CSlant\LaravelLike\Facades\Like;

Like::unlike($post);
Like::unDislike($post);
Like::unlove($post);
```

All remove operations are **transactional** — they run inside a `DB::transaction` for data consistency.

:::tip Return value

`unlike()` returns `true` if a `LIKE` row was deleted. It returns `false` if the user never liked the model in the first place. The same applies to `unDislike()` and `unlove()`.

:::

---

## Remove all interactions on a model

Use `forgetInteractions()` to delete **all** interaction rows (all users, all types) on a given model:

```php
$post = Post::find(1);

$post->forgetInteractions();         // Deletes everything
$post->forgetInteractions('like');   // Deletes only likes (all users)
$post->forgetInteractions('dislike');
$post->forgetInteractions('love');
```

`forgetInteractionsOfType()` is an alias for filtering by a single type:

```php
$post->forgetInteractionsOfType('like');
```

:::caution Caution

These methods delete all rows for all users. Use them sparingly — typically only when deleting the parent model itself.

:::

---

## Remove all interactions by a user

The `UserHasInteraction` trait on your User model also provides `forgetInteractions()`:

```php
$user = User::find(1);

$user->forgetInteractions();       // Removes all of this user's interactions
$user->forgetInteractions('like');  // Removes only this user's likes
```

To remove a specific user's interaction on a specific model, use the `likes()` relationship directly:

```php
$post->likes()
    ->where('user_id', $userId)
    ->delete();
```

---

## Toggle interactions

See the dedicated [Toggle Interactions](toggle_interactions.md) page for the `toggle()` method, which cycles between states (like → remove, dislike → like, etc.).

---

## Practical examples

### Like button in a controller

```php
use CSlant\LaravelLike\Facades\Like;

class PostLikeController extends Controller
{
    public function toggleLike(Post $post)
    {
        $liked = $post->isLiked();

        if ($liked) {
            $post->unlike();
            $status = 'unliked';
        } else {
            $post->like();
            $status = 'liked';
        }

        return response()->json([
            'status' => $status,
            'likes_count' => $post->likesCount(),
        ]);
    }
}
```

### Bulk remove old interactions

```php
use CSlant\LaravelLike\Models\Like;

// Remove all interactions older than 90 days for a specific model type
Like::where('model_type', Post::class)
    ->where('created_at', '<', now()->subDays(90))
    ->delete();
```

---

## Next Steps

- [Liking content](liking_content.md) — how to add interactions
- [Toggle interactions](toggle_interactions.md) — cycling between states
- [Check if interacted](check_if_interacted.md) — verifying interaction status
- [User Interaction Trait](user_interaction_trait.md) — managing interactions from the user side