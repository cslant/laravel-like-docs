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

// Facades proxy the very same instance, each scoped to its own domain:
Like::like($post);
Love::love($post);
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
| `likeCountsFor(Collection $models, InteractionTypeEnum $type = LIKE)` | `array<int\|string, int>` | Counts of one interaction type, batched for a collection of models |
| `userInteractionsFor(Collection $models, ?int $userId = null)` | `Collection<string, Like>` | A user's interaction per model, batched for a collection of models |

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

## `likeCountsFor()` — batch counts for a list

Given a `Collection` of models, returns per-type counts in a **single query** (grouped internally per distinct model class). Use this instead of calling `$model->likesCount()` inside a loop:

```php
use CSlant\LaravelLike\Facades\Like;
use CSlant\LaravelLike\Enums\InteractionTypeEnum;

$posts = Post::limit(50)->get();

$counts = Like::likeCountsFor($posts, InteractionTypeEnum::LIKE);
// ['1' => 12, '3' => 47, ...] — keyed by model primary key

foreach ($posts as $post) {
    echo $counts[$post->getKey()] ?? 0;
}
```

A model with zero interactions of that type simply has no entry in the array — default to `0` with `$counts[$post->getKey()] ?? 0`.

:::tip When to prefer `withCount()` instead

If you're already building the query (`Post::query()...`), `Post::withCount('likesTo as likes_count')` (see [Counting interactions](counting_interactions.md)) is usually simpler — it's one query with zero extra code. Reach for `likeCountsFor()` when you already have a `Collection` from somewhere else (a cache, a search index, a different repository method) and can't reshape the original query.

:::

## `userInteractionsFor()` — batch interaction check for a list

The single-model predicates (`isLiked()`, `isDisliked()`, `isLoved()`) cost one `EXISTS` query **each** — fine for one model, but calling them inside a loop over a list is an N+1. `userInteractionsFor()` resolves the current user's interaction state for every model in a collection in one query:

```php
use CSlant\LaravelLike\Facades\Like;

$posts = Post::limit(50)->get();
$interactions = Like::userInteractionsFor($posts, auth()->id());

foreach ($posts as $post) {
    $key = $post->getMorphClass().':'.$post->getKey();
    $interaction = $interactions->get($key);

    $isLiked = $interaction?->type->isLike() ?? false;
}
```

The collection is keyed by `"{morphClass}:{modelKey}"` (not just the model key) so it stays correct even when the source `Collection` mixes several model classes, e.g. results from `userLikedModels()`. A model the user has not interacted with simply has no entry.

## `totalCount()`

Counts likes + dislikes + loves on a model in a single query:

```php
$total = Like::totalCount($post);   // e.g. 10
```

Note that `totalCount()` exists only on the manager/facade — there is no `$post->totalCount()` model helper.

## `Like` vs `Love` facade

Both facades proxy the **same** `LikeManager` singleton — there's only one underlying service. What differs is the method set each facade **advertises** via its docblock (autocomplete, static analysis), so each stays focused on its own domain:

| Facade | Advertises | Does not advertise |
| --- | --- | --- |
| `Like` | `like`, `dislike`, `unlike`, `unDislike`, `toggle`, `isLiked`, `isDisliked`, `likesCount`, `dislikesCount`, `totalCount`, `userInteractions`, `userLikedModels`, `likeCountsFor`, `userInteractionsFor` | `love`, `unlove`, `isLoved`, `lovesCount` |
| `Love` | `love`, `unlove`, `isLoved`, `lovesCount`, `totalCount`, `userInteractions`, `likeCountsFor`, `userInteractionsFor` | `like`, `dislike`, `unlike`, `unDislike`, `toggle`, `isLiked`, `isDisliked`, `likesCount`, `dislikesCount`, `userLikedModels` |

```php
use CSlant\LaravelLike\Facades\Love;

Love::love($post);   // create a love for auth()->user()
Love::unlove($post);
Love::isLoved($post);
```

:::info This is a static-analysis boundary, not a runtime one

Because both facades resolve to the same singleton, `Love::like($post)` still **works** at runtime (Laravel facades don't check docblocks) — it's just no longer suggested by your IDE or accepted by PHPStan through the `Love` facade, since `like()`/`unlike()` conceptually belong to the `Like` facade. Reach for the `Like` facade for like/dislike behaviour and `Love` for love behaviour to keep intent unambiguous in your codebase.

:::

## Errors

| Scenario | Exception |
| --- | --- |
| User not authenticated and `$userId` not given | `Illuminate\Auth\AuthenticationException` |
| Model is not persisted (`exists === false`) | `InvalidArgumentException` |

## Next Steps

- [Toggle interactions](toggle_interactions.md) — the toggle state machine
- [User interactions trait](user_interaction_trait.md) — the user-side `likes()` relationship
- [Performance](performance.md) — query-cost guarantees and optimisation