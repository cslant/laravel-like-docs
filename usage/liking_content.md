---
title: Liking Content | Laravel Like
description: Learn how to add like, dislike, and love interactions to your Eloquent models using the Laravel Like package.
keywords: ['laravel like', 'like content', 'dislike content', 'love content', 'add reactions', 'social interactions', 'eloquent models', 'like method']
tags: ['Basic Usage', 'Likes', 'Dislikes', 'Interactions', 'Tutorial']
---

# Liking and Disliking Content

The Laravel Like package provides a simple, transactional way to add like, dislike, and love interactions to any Eloquent model. This guide covers the core action methods — both from your model and from the `Like`/`Love` facades.

## Prerequisites

- [Installation](../getting-started/installation.md) completed
- `HasLike` trait added to your content model (or `HasLove` for love-only surfaces)
- User authentication set up (for automatic user resolution) — or pass an explicit user id

## Available action methods

| Method | Return | Description |
| --- | --- | --- |
| `like($userId?)` | `Like` | Like the model. Idempotent (no-op if already liked). |
| `dislike($userId?)` | `Like` | Dislike the model. Idempotent. |
| `love($userId?)` | `Like` | Love the model. Idempotent. |

These are available on:

1. **Any model** with the `HasLike` or `HasLove` trait (via `$model->like()` etc.)
2. **The `Like` and `Love` facades** (via `Like::like($model)` etc.)
3. **The `LikeManager` class** (via `app(LikeManager::class)->like($model)`)

All three options are equivalent. Pick the one that fits your context.

## Basic usage

### From the model

```php
$post = Post::find(1);

// Assumes auth()->id() as the user
$post->like();
$post->dislike();
$post->love();
```

### From the facade

```php
use CSlant\LaravelLike\Facades\Like;

$video = Video::find(1);

Like::like($video);
Like::dislike($video);
Like::love($video);
```

### Explicit user id

To interact on behalf of a different user (or when unauthenticated), pass the user id as the second argument:

```php
$post->like($someOtherUserId);
Like::like($post, $someOtherUserId);
```

:::info Authentication requirement

If you don't pass a user id and `Auth::id()` returns `null` or `0`, an `Illuminate\Auth\AuthenticationException` is thrown. Make sure the user is logged in, or pass an explicit user id.

:::

## What happens under the hood

All three action methods are **idempotent** and **single-active**:

- **Idempotent:** calling `like()` on a model you already liked returns the existing `Like` row without creating a duplicate.
- **Single-active:** a user can only have **one** interaction type per model at a time. Setting a new type deletes any other existing interaction for that user + model combination, all inside a database transaction.

```php
$post->like();        // Creates a LIKE row
$post->like();        // Returns existing LIKE row — no duplicate
$post->dislike();     // Deletes the LIKE row, creates a DISLIKE row
```

The returned `Like` model gives you full access to the interaction record:

```php
$like = $post->like();

$like->type;                   // InteractionTypeEnum::LIKE
$like->user_id;                // 1
$like->model_id;               // 1
$like->model_type;             // 'App\Models\Post'
$like->created_at;             // Carbon instance
```

## Model must be saved first

The model must already exist in the database (i.e. `$model->exists` must be `true`). Interacting with an unsaved model throws an `InvalidArgumentException`:

```php
$post = new Post(['title' => 'New']);
// ❌ Throws InvalidArgumentException — model is not persisted
$post->like();

$post->save(); // First save the model
$post->like(); // ✅ Works
```

## Transactional safety

All actions are wrapped in database transactions. If anything fails (database constraint, race condition), the transaction is rolled back automatically — no partial rows are created.

## Next Steps

- [Removing interactions](unliking_content.md) — `unlike()`, `unlove()`, `unDislike()`, `forgetInteractions()`
- [Toggle interactions](toggle_interactions.md) — single tap toggling between states
- [Check if interacted](check_if_interacted.md) — `isLiked()`, `isLikedBy()`, `isInteractedBy()`
- [The LikeManager & Facade API](like_manager.md) — full method reference