---
title: Customizing User Interaction | Laravel Like
description: Learn how to customize user interactions in the Laravel Like package, including custom interaction models, custom user models, and extending default behavior.
keywords: ['laravel like', 'customize interaction', 'custom model', 'extend interaction', 'user interaction', 'configuration']
tags: ['Customization', 'User Interaction', 'Custom Model', 'Configuration', 'Advanced', 'Tutorial']
---

# Customizing User Interaction

This guide explains how to customize user interactions in the Laravel Like package. You can extend the default behavior by creating custom interaction models, configuring user models, and adding your own interaction logic.

## Prerequisites

- Laravel 9.0 or higher
- PHP 8.1 or higher
- Laravel Like package installed and configured
- Basic understanding of [User Interaction Trait](user_interaction_trait.md)

## Custom User Model Configuration

If your application uses a custom user model or a different primary key, update the `config/like.php` file:

```php
// config/like.php
return [
    'interaction_model' => \CSlant\LaravelLike\Models\Like::class,

    'users' => [
        'model' => \App\Models\CustomUser::class,  // Your custom user model
        'foreign_key' => 'author_id',                // Custom foreign key
    ],
];
```

## Custom Interaction Model

You can create a custom interaction model to extend the default `Like` model with additional fields or methods.

### Step 1: Create the Custom Model

```php
namespace App\Models;

use CSlant\LaravelLike\Models\Like;

class Interaction extends Like
{
    /**
     * Additional fillable attributes.
     */
    protected $fillable = [
        'user_id',
        'model_id',
        'model_type',
        'type',
        'comment',    // Custom field
        'metadata',   // Custom field
    ];

    /**
     * Custom cast attributes.
     */
    protected $casts = [
        'model_type' => 'string',
        'type' => \CSlant\LaravelLike\Enums\InteractionTypeEnum::class,
        'metadata' => 'array',
    ];

    /**
     * Get a summary of the interaction.
     */
    public function getSummaryAttribute(): string
    {
        return "{$this->user->name} {$this->type->value}d this content";
    }
}
```

### Step 2: Create a Migration for Custom Fields

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

### Step 3: Update Configuration

```php
// config/like.php
return [
    'interaction_model' => \App\Models\Interaction::class,
    // ...
];
```

## Extending the UserHasInteraction Trait

You can override methods from the `UserHasInteraction` trait in your User model:

```php
use CSlant\LaravelLike\UserHasInteraction;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use UserHasInteraction;

    /**
     * Get only liked content by this user.
     */
    public function likedContent()
    {
        return $this->likes()->where('type', 'like');
    }

    /**
     * Get only disliked content by this user.
     */
    public function dislikedContent()
    {
        return $this->likes()->where('type', 'dislike');
    }

    /**
     * Get only loved content by this user.
     */
    public function lovedContent()
    {
        return $this->likes()->where('type', 'love');
    }

    /**
     * Get interactions for a specific model type.
     */
    public function interactionsFor(string $modelClass)
    {
        return $this->likes()->where('model_type', $modelClass);
    }
}
```

### Usage

```php
$user = User::find(1);

// Get all liked posts
$likedPosts = $user->likedContent()
    ->where('model_type', Post::class)
    ->with('model')
    ->get();

// Get all interactions for articles
$articleInteractions = $user->interactionsFor(Article::class)->get();
```

## Custom Interaction Types

The package uses the `InteractionTypeEnum` enum with built-in types: `like`, `dislike`, and `love`. If you want to add custom logic based on these types:

```php
use CSlant\LaravelLike\Enums\InteractionTypeEnum;

class User extends Authenticatable
{
    use UserHasInteraction;

    /**
     * Get the user's interaction stats.
     */
    public function getInteractionStats(): array
    {
        $interactions = $this->likes()->get();

        return [
            'likes' => $interactions->where('type', InteractionTypeEnum::LIKE)->count(),
            'dislikes' => $interactions->where('type', InteractionTypeEnum::DISLIKE)->count(),
            'loves' => $interactions->where('type', InteractionTypeEnum::LOVE)->count(),
            'total' => $interactions->count(),
        ];
    }

    /**
     * Get the user's most interacted content type.
     */
    public function getMostInteractedType(): ?string
    {
        return $this->likes()
            ->selectRaw('model_type, COUNT(*) as count')
            ->groupBy('model_type')
            ->orderByDesc('count')
            ->value('model_type');
    }
}
```

## Practical Example: User Dashboard

```php
// In your controller
public function dashboard()
{
    $user = auth()->user();

    $data = [
        'stats' => $user->getInteractionStats(),
        'recent_likes' => $user->likedContent()
            ->with('model')
            ->latest()
            ->take(5)
            ->get(),
        'recent_loves' => $user->lovedContent()
            ->with('model')
            ->latest()
            ->take(5)
            ->get(),
    ];

    return view('dashboard', $data);
}
```

## Next Steps

- Learn about [User Interaction Trait](user_interaction_trait.md) for basic setup
- Check out [Change Default Interaction](change_default_interaction.md) model
- Explore [Query Scopes](query_scopes.md) for advanced queries

