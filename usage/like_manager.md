---
title: LikeManager & Facade API | Laravel Like
description: Full API reference for the LikeManager class and the Like / Love facades in the Laravel Like package.
keywords: ['laravel like', 'LikeManager', 'facade', 'Like facade', 'Love facade', 'userInteractions', 'userLikedModels', 'totalCount', 'API reference']
tags: ['LikeManager', 'Facade', 'API Reference', 'Interactions', 'Advanced', 'Tutorial']
---

# LikeManager & Facade API

Everything the model helpers do is backed by a single service: **`CSlant\LaravelLike\LikeManager`**, bound as a singleton behind the `CSlant\LaravelLike\Contracts\LikeManager` contract. The `Like` and `Love` facades both point at the same instance.

```php
use CSlant\LaravelLike\Facades\Like;
use CSlant\LaravelLike\Facades\Love;
use CSlant\LaravelLike\LikeManager;
use CSlant\LaravelLike\Contracts\LikeManager as LikeManagerContract;

$manager = app(LikeManager::class);          // ← or
$manager = app(LikeManagerContract::class);  // ← same singleton
$manager = app('like');                      // ← alias

// Facades proxy the very same instance:
Like::like($post);
Love::like($post);   // identical to Like::like($post)
```

Since it's a singleton with a contract binding, you can type-hint it anywhere (controllers, services, jobs):

```php
use CSlant\LaravelLike\Contracts\LikeManager;

class PostController extends Controller
{
    public function __construct(private readonly LikeManager $likeManager) {}

    public function react(Request $request, Post $post)
    {
        $this->likeManager->like($post); // user resolved from auth()
    }
}
```

## Method reference

| Method | Returns | Description |
| --- | --- | --- |
| `like(Model $m, ?int $userId = null)` | `Like` | Create a like (idempotent, transactional) |
| `dislike(Model $m, ?int $userId = null)` | `Like` | Create a dislike (idempotent, transactional) |
| `love(Model $m, ?int $userId = null)` | `Like` | Create a love (idempotent, transactional) |
| `unlike(Model $m, ?int $userId = null)` | `bool` | Remove the like (false if none) |
| `unDislike(Model $m, ?int $userId = null)` | `bool` | Remove the dislike (false if none) |
| `unlove(Model $m, ?int $userId = null)` | `bool` | Remove the love (false if none) |
| `toggle(Model $m, ?int $userId = null)` | `?Like` | Cycle states (see [Toggle](toggle_interactions.md)) |
| `isLiked(Model $m, ?int $userId = null)` | `bool` | Does the user like it? |
| `isDisliked(Model $m, ?int $userId = null)` | `bool` | Does the user dislike it? |
| `isLoved(Model $m, ?int $userId = null)` | `bool` | Does the user love it? |
| `likesCount(Model $m)` | `int` | Number of likes on the model |
| `dislikesCount(Model $m)` | `int` | Number of dislikes on the model |
| `lovesCount(Model $m)` | `int` | Number of loves on the model |
| `totalCount(Model $m)` | `int` | All interactions on the model |
| `userInteractions(?int $userId = null)` | `Collection<Like>` | A user's interaction records |
| `userLikedModels(?int $userId = null)` | `Collection<Model>` | The actual models a user liked (only `like` type) |

All methods take the model as the **first** argument — unlike the model helpers (`$post->like()`), the manager/facade is static-ish:

```php
use CSlant\LaravelLike\Facades\Like;

$like = Like::like($post, $userId);   // explicit user
$like = Like::like($post);            // auth()->id() user
```

## User resolution

- `$userId = null` → resolved via `auth()->id()`.
- If the resolved id is `null` or `0`, an `Illuminate\Auth\AuthenticationException` is thrown.
- Pass an explicit `$userId` to bypass authentication entirely (useful for CLI jobs, queues, or admin tools).

```php
// Works without any auth session
Like::like($post, 42);
```

## `userInteractions()`

Returns a `Collection` of the user's interaction **records** (all types):

```php
use CSlant\LaravelLike\Facades\Like;

$interactions = Like::userInteractions();          // current user
$interactions = Like::userInteractions($userId);   // specific user

foreach ($interactions as $interaction) {
    echo $interaction->type->value;   // 'like' | 'dislike' | 'love'
    echo $interaction->model_type;    // 'App\Models\Post'
    echo $interaction->model_id;
}
```

To resolve the related content/user, access the relations **eagerly**:

```php
// Eager-load the interacted models in one pass
$rows = \CSlant\LaravelLike\Models\Like::query()
    ->where('user_id', $userId)
    ->with('model', 'user')
    ->get();
```

## `userLikedModels()`

Returns a `Collection` of the **actual content models** the user liked (type `like` only — dislikes and loves are excluded). Mixed model types are all returned in a single collection:

```php
$likedModels = Like::userLikedModels($userId);

// Contains Post, Video, Article... whatever the user liked:
foreach ($likedModels as $model) {
    echo get_class($model) . ' #' . $model->getKey();
}
```

:::info Query cost

This method performs **one query for the user's likes, plus one query per distinct model type** (because the models are fetched polymorphically). That's bounded and constant — it does not grow per row. See [Performance](performance.md).

:::

## `totalCount()`

Counts likes + dislikes + loves on a model in a single query:

```php
$total = Like::totalCount($post);   // e.g. 10
```

Note that `totalCount()` exists only on the manager/facade — there is no `$post->totalCount()` model helper.

## `LIKE` vs `LOVE` facade

Both facades expose the same methods. Use them to be explicit about intent:

```php
use CSlant\LaravelLike\Facades\Love;

Love::love($post);   // create a love for auth()->user()
Love::unlove($post);
Love::isLoved($post);
```

## Errors

| Scenario | Exception |
| --- | --- |
| User not authenticated and `$userId` not given | `Illuminate\Auth\AuthenticationException` |
| Model is not persisted (`exists === false`) | `InvalidArgumentException` |

## Next Steps

- [Toggle interactions](toggle_interactions.md) — the toggle state machine
- [User interactions trait](user_interaction_trait.md) — the user-side `likes()` relationship
- [Performance](performance.md) — query-cost guarantees and optimisation