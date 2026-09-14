---
title: Checking Interactions | Laravel Like
description: Learn how to check if users have interacted with content in your Laravel application using the Laravel Like package.
keywords: ['laravel like', 'check interactions', 'verify likes', 'check dislikes', 'check loves', 'interaction status', 'isLiked', 'isInteractedBy']
tags: ['Interactions', 'Checking', 'Verification', 'Status', 'Tutorial']
---

# Checking Interactions

This guide explains how to check if users have interacted with your content using the Laravel Like package. You can verify likes, dislikes, and loves on your Eloquent models with a few method calls.

## Prerequisites

- [Installation](../getting-started/installation.md) completed
- `HasLike` / `HasLove` trait on your content model

## Check the current user's state

The `isX()` methods resolve the user automatically via `auth()->id()`:

```php
$post = Post::find(1);

if ($post->isLiked()) {
    // The current user has liked this post
}

if ($post->isDisliked()) {
    // The current user has disliked this post
}

if ($post->isLoved()) {
    // The current user has loved this post
}
```

## Check a specific user's state

The `isXBy($userId)` methods take an explicit user id. `isLikedBy()` and `isDislikedBy()` come from `HasLike`; `isLovedBy()` comes from `HasLove`:

```php
$userId = 7;

if ($post->isLikedBy($userId)) {
    // User 7 has liked this post
}

if ($post->isDislikedBy($userId)) {
    // User 7 has disliked this post
}

if ($post->isLovedBy($userId)) {
    // User 7 has loved this post (requires HasLove)
}
```

:::info Auth vs explicit user

- `isLiked()` → uses `auth()->id()` (deducted user)
- `isLikedBy($userId)` → checks a specific user regardless of who is logged in

:::

## Check for any interaction (or a specific type)

Use `isInteractedBy()` to check whether a user has **any** interaction, or an interaction of a **specific type**:

```php
use CSlant\LaravelLike\Enums\InteractionTypeEnum;

// Any interaction (like, dislike, or love)
if ($post->isInteractedBy($userId)) {
    // User has interacted with this post
}

// A specific interaction type
if ($post->isInteractedBy($userId, InteractionTypeEnum::LIKE)) {
    // User specifically liked this post
}
```

`withInteractionBy()` is the relationship-level variant. It returns a query you can further refine:

```php
use CSlant\LaravelLike\Enums\InteractionTypeEnum;

$interactions = $post->withInteractionBy($userId)
    ->where('type', InteractionTypeEnum::LIKE)
    ->get();

$hasLike = $post->withInteractionBy($userId, InteractionTypeEnum::LIKE)->exists();
```

## The interaction type as a string

Each `Like` record exposes the interaction type via the `interaction_type` accessor:

```php
$post = Post::find(1);

// Nothing to call on the Post itself — look at the current user's interaction:
$interaction = $post->likes()
    ->where('user_id', auth()->id())
    ->first();

if ($interaction) {
    $type = $interaction->interaction_type; // 'like', 'dislike', or 'love'
}
```

The `type` column itself is cast to `CSlant\LaravelLike\Enums\InteractionTypeEnum`, so you can also compare enum values directly:

```php
use CSlant\LaravelLike\Enums\InteractionTypeEnum;

switch ($interaction->type) {
    case InteractionTypeEnum::LIKE:
        // handle like
        break;
    case InteractionTypeEnum::DISLIKE:
        // handle dislike
        break;
    case InteractionTypeEnum::LOVE:
        // handle love
        break;
    default:
        // no (neutral) interaction
        $value = $interaction->type->value; // raw string
}
```

## Reference table

| Method | Where | Arguments | Returns |
| --- | --- | --- | --- |
| `isLiked()` | `HasLike`/`HasLove` model | `?int $userId` | `bool` |
| `isDisliked()` | `HasLike`/`HasLove` model | `?int $userId` | `bool` |
| `isLoved()` | `HasLike`/`HasLove` model | `?int $userId` | `bool` |
| `isLikedBy($userId)` | `HasLike` model | `int` | `bool` |
| `isDislikedBy($userId)` | `HasLike` model | `int` | `bool` |
| `isLovedBy($userId)` | `HasLove` model | `int` | `bool` |
| `isInteractedBy($userId, ?enum)` | `HasLike`/`HasLove` model | `int`, `?InteractionTypeEnum` | `bool` |
| `withInteractionBy($userId, ?enum)` | `HasLike`/`HasLove` model | `int`, `?InteractionTypeEnum` | `MorphMany` |
| `InteractionTypeEnum::isValid($value)` | static | `enum\|string\|null` | `bool` |
| `InteractionTypeEnum::getTypeByValue($string)` | static | `string` | `InteractionTypeEnum` |

> All predicate methods use SQL `EXISTS` under the hood — calling them on many models in a loop does **not** cause N+1 queries. See [Performance](performance.md).

## Next Steps

- [Counting interactions](counting_interactions.md) — aggregate interaction statistics
- [Managing user interactions](user_interaction_trait.md) — the user side of interactions
- [Performance](performance.md) — query optimisation tips