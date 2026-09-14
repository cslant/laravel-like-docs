---
title: Customizing User Interaction | Laravel Like
description: Learn how to customize user interactions in the Laravel Like package, including custom interaction models, custom user models, and extending default behavior.
keywords: ['laravel like', 'customize interaction', 'custom model', 'extend interaction', 'user interaction', 'configuration']
tags: ['Customization', 'User Interaction', 'Custom Model', 'Configuration', 'Advanced', 'Tutorial']
---

# Customizing User Interaction

This guide explains how to customize interactions in the Laravel Like package. You can extend the default behavior with custom interaction models, configure different user models, and add your own interaction logic.

## Prerequisites

- [Installation](../getting-started/installation.md) completed
- Basic understanding of the [User Interaction Trait](user_interaction_trait.md)

## Custom user model

If your application uses a different User model or a custom foreign key, update `config/like.php`:

```php
// config/like.php
return [
    'users' => [
        'model' => \App\Modules\User\CustomUser::class, // Custom user model
        'foreign_key' => 'author_id',                    // Custom foreign key
    ],
];
```

When `model` is `null`, the package automatically falls back to `config('auth.providers.users.model')`.

:::warning Migration

If you change the foreign key, the `likes` table must use the same column name. Run `php artisan migrate:rollback` and `php artisan migrate` afterwards, or write a migration to rename the column.

:::

## Custom interaction model

You can extend the default `Like` model with additional fields or methods.

### Step 1: Create the custom model

Extend `CSlant\LaravelLike\Models\Like`:

```php
namespace App\Models;

use CSlant\LaravelLike\Models\Like;

class CustomLike extends Like
{
    /**
     * Base fillable fields are inherited from Like.
     * Append your additional fields here.
     */
    protected $fillable = [
        'user_id',
        'model_id',
        'model_type',
        'type',
        'comment',
        'metadata',
    ];

    /**
     * Custom casts.
     */
    protected $casts = [
        'model_type' => 'string',
        'type' => \CSlant\LaravelLike\Enums\InteractionTypeEnum::class,
        'metadata' => 'array',
    ];

    /**
     * A custom accessor for the record.
     */
    public function getSummaryAttribute(): string
    {
        return "{$this->user->name} marked this content as {$this->interaction_type}";
    }
}
```

> The `type` cast, `user()` / `model()` relationships, UUID handling, and `interaction_type` accessor all come for free from the base `Like` model.

### Step 2: Add a migration for the new columns

```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('likes', function (Blueprint $table) {
            $table->text('comment')->nullable()->after('type');
            $table->json('metadata')->nullable()->after('comment');
        });
    }

    public function down(): void
    {
        Schema::table('likes', function (Blueprint $table) {
            $table->dropColumn(['comment', 'metadata']);
        });
    }
};
```

### Step 3: Point the config at your model

```php
// config/like.php
return [
    'interaction_model' => \App\Models\CustomLike::class,
];
```

After this, **every** relationship and action returns your `CustomLike` instances:

```php
$post->like();                  // returns App\Models\CustomLike
$post->likes()->get();          // collection of CustomLike
auth()->user()->likes()->get(); // collection of CustomLike
```

## Extending the `UserHasInteraction` trait

Override or add methods in your User model:

```php
use CSlant\LaravelLike\UserHasInteraction;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use UserHasInteraction;

    /**
     * The user's liked content (scoped to a type).
     */
    public function likedContent()
    {
        return $this->likes()->where('type', 'like');
    }

    /**
     * Interactions scoped to a specific model class.
     */
    public function interactionsFor(string $modelClass)
    {
        return $this->likes()->where('model_type', $modelClass);
    }
}
```

Usage:

```php
$user = User::find(1);

$likedPosts = $user->likedContent()
    ->where('model_type', Post::class)
    ->with('model')
    ->get();

$articleInteractions = $user->interactionsFor(Article::class)->get();
```

## Interaction types

The package ships a fixed string-backed enum, `InteractionTypeEnum`, with four cases:

```php
use CSlant\LaravelLike\Enums\InteractionTypeEnum;

InteractionTypeEnum::NEUTRAL;                                    // 'neutral'
InteractionTypeEnum::LIKE;                                       // 'like'
InteractionTypeEnum::DISLIKE;                                    // 'dislike'
InteractionTypeEnum::LOVE;                                       // 'love'

InteractionTypeEnum::LIKE->isLike();                             // true
InteractionTypeEnum::getValuesAsStrings();                      // ['like', 'dislike', 'love']
InteractionTypeEnum::getTypeByValue('like') === InteractionTypeEnum::LIKE; // true
InteractionTypeEnum::isValid('love');                           // true
InteractionTypeEnum::isValid('star');                           // false
```

:::caution Adding custom types

The enum cases are **fixed** to `like`, `dislike`, and `love`. Adding a brand-new type (e.g. "star") would require overriding the enum, the migration's unique constraint, and the `getValuesAsStrings()` list. For custom behaviour, prefer adding **extra columns** to a custom interaction model (see above) over inventing new types.

:::

### Stats based on interaction types

Valid patterns for aggregating by type:

```php
public function getInteractionStats(): array
{
    $interactions = $this->likes()->get();

    return [
        'likes'    => $interactions->where('type', InteractionTypeEnum::LIKE)->count(),
        'dislikes' => $interactions->where('type', InteractionTypeEnum::DISLIKE)->count(),
        'loves'    => $interactions->where('type', InteractionTypeEnum::LOVE)->count(),
        'total'    => $interactions->count(),
    ];
}
```

## A note on relationship collisions

`UserHasInteraction` defines `likes()` as a **hasMany**. `HasLike`/`HasLove` define `likes()` as a **morphMany**. These two must never be composed on the same model — put `UserHasInteraction` only on your User model, and `HasLike`/`HasLove` only on your content models.

## Next Steps

- [Change the default interaction model](change_default_interaction.md) — swap `interaction_model` in config
- [Query scopes](query_scopes.md) — advanced queries
- [Performance](performance.md) — keep custom queries fast