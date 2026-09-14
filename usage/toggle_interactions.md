---
title: Toggle Interactions | Laravel Like
description: Learn how to use the toggle() method to switch between like, dislike, and neutral states with the Laravel Like package.
keywords: ['laravel like', 'toggle', 'toggle interaction', 'like dislike toggle', 'interaction states', 'single active interaction']
tags: ['Toggle', 'Interactions', 'States', 'Basic Usage', 'Tutorial']
---

# Toggle Interactions

`toggle()` is designed for the classic "dislike ↔ like" UI where a single user action switches between states. It's available on the model, the facade, and the `LikeManager`.

## Prerequisites

- [Installation](../getting-started/installation.md) completed
- `HasLike` / `HasLove` trait on your content model

## How toggle works

`toggle()` follows a fixed circuit based on the user's **current** interaction:

| Current interaction | `toggle()` result |
| --- | --- |
| none | Creates a **like** and returns the `Like` row |
| like | Removes the interaction and returns `null` |
| dislike | Changes the interaction to **like** and returns the `Like` row |
| love | Leaves it unchanged and returns the current `Like` row |

### Usage from the model

```php
$post = Post::find(1);

$post->toggle();        // none  → LIKE (returns Like)
$post->toggle();        // like  → removed (returns null)
$post->toggle();        // none  → LIKE again
```

### Usage from the facade

```php
use CSlant\LaravelLike\Facades\Like;

$result = Like::toggle($post);
// $result is a Like instance, or null if the interaction was removed
```

### Explicit user id

```php
$post->toggle($someOtherUserId);
```

## Why this circuit?

Because the package guarantees **"single-active"** interactions — a user can only have one interaction type per model at a time — `toggle()` gives you a predictable state machine without ever having two rows for the same user + model:

| User action | Before | After |
| --- | --- | --- |
| Click like on a none state | `type = null` | `type = like` |
| Click like on a like state | `type = like` | `type = null` (removed) |
| Click like on a dislike state | `type = dislike` | `type = like` |
| Click like on a love state | `type = love` | `type = love` (unchanged) |

## The `Like` model's own toggle

If you already hold a `Like` record, `toggleLikeInteraction()` mutates it in memory (like ↔ dislike) and returns the new type as a string:

```php
use CSlant\LaravelLike\Models\Like;

$like = Like::where('user_id', auth()->id())
    ->where('model_type', Post::class)
    ->where('model_id', $post->id)
    ->first();

if ($like) {
    $newType = $like->toggleLikeInteraction(); // 'dislike' if it was 'like'
    $like->save();
}
```

:::info

`toggleLikeInteraction()` updates the in-memory value, so you must `save()` afterwards. It toggles **between like and dislike only** — love interactions are intentionally unaffected.

:::

## Practical example: single-button like

```php
use CSlant\LaravelLike\Facades\Like;

class PostLikeController extends Controller
{
    public function toggleLike(Post $post)
    {
        $interaction = Like::toggle($post);

        return response()->json([
            'liked' => $interaction !== null && $interaction->isLiked(),
            'likes_count' => $post->likesCount(),
        ]);
    }
}
```

Tap once → liked. Tap again → unliked. No extra state tracking needed in your application.

## Next Steps

- [Checking interactions](check_if_interacted.md) — verify current state before rendering the button
- [Liking content](liking_content.md) — the explicit `like()` / `dislike()` / `love()` methods
- [Unliking content](unliking_content.md) — `unlike()`, `unlove()`, `unDislike()`, `forgetInteractions()`