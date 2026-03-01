---
title: Liking Content | Laravel Like
description: Learn how to implement like and dislike functionality in your Laravel application using the Laravel Like package. Add interactions to your Eloquent models.
keywords: ['laravel like', 'like content', 'dislike content', 'add reactions', 'social interactions', 'eloquent models']
tags: ['Basic Usage', 'Likes', 'Dislikes', 'Interactions', 'Tutorial']
---

# Liking and Disliking Content

The Laravel Like package provides a simple way to add like and dislike functionality to your Eloquent models. This guide will show you how to implement these features in your application.

## Prerequisites

- Laravel 9.0 or higher
- PHP 8.1 or higher
- The package installed and configured (see [Installation](../getting-started/installation.md))
- User authentication set up (for tracking who interacted with content)

## Setting Up Your Models

### 1. Prepare Your Content Model

To enable interactions on a model, add the `HasLike` trait to it:

```php
use CSlant\LaravelLike\HasLike;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasLike;
    
    // Your model code...
}
```

### 2. Set Up User Model (Optional)

To track which users have interacted with content, add the `UserHasInteraction` trait to your User model:

```php
use CSlant\LaravelLike\UserHasInteraction;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use UserHasInteraction;
    
    // Your model code...
}
```

## Basic Usage

### Liking Content

To like a model instance:

```php
$post = Post::find(1);
$user = auth()->user();

// Like the post
$post->likeTo()->create([
    'user_id' => $user->id,
    'type' => \CSlant\LaravelLike\Enums\InteractionTypeEnum::LIKE
]);
```

### Disliking Content

To dislike a model instance:

```php
$post = Post::find(1);
$user = auth()->user();

// Dislike the post
$post->dislikeTo()->create([
    'user_id' => $user->id,
    'type' => \CSlant\LaravelLike\Enums\InteractionTypeEnum::DISLIKE
]);
```

## Checking Interactions

Check if a user has interacted with content:

```php
use CSlant\LaravelLike\Enums\InteractionTypeEnum;

// Check if a specific user has liked the post
if ($post->isLikedBy($user->id)) {
    // The specified user has liked this post
}

// Check if a specific user has disliked the post
if ($post->isDislikedBy($user->id)) {
    // The specified user has disliked this post
}

// Check if a user has any interaction with the post
if ($post->isInteractedBy($user->id)) {
    // The user has some interaction with the post
}

// Check with a specific interaction type
if ($post->isInteractedBy($user->id, InteractionTypeEnum::LIKE)) {
    // The user has liked the post
}
```

## Getting Interaction Counts

Get the number of interactions:

```php
// Get like count
$likeCount = $post->likesCount();

// Get dislike count
$dislikeCount = $post->dislikesCount();

// Get like count in digital format (e.g., '1.2K')
$likeCountDigital = $post->likesCountDigital();

// Get dislike count in digital format (e.g., '1.2K')
$dislikeCountDigital = $post->dislikesCountDigital();

// Get all interactions for the post
$interactions = $post->likes()->get();

// Get all likes
$likes = $post->likesTo()->get();

// Get all dislikes
$dislikes = $post->dislikesTo()->get();
```

## Removing Interactions

Remove an interaction:

```php
use CSlant\LaravelLike\Enums\InteractionTypeEnum;

// Remove a specific user's like
$post->likesTo()
    ->where('user_id', $user->id)
    ->delete();

// Remove a specific user's dislike
$post->dislikesTo()
    ->where('user_id', $user->id)
    ->delete();

// Remove all interactions of a specific type
$post->forgetInteractionsOfType(InteractionTypeEnum::LIKE);

// Remove all interactions
$post->forgetInteractions();
```

## Toggle Interactions

Toggle between different interaction states:

```php
use CSlant\LaravelLike\Enums\InteractionTypeEnum;

// Check current interaction type (if any)
$interaction = $post->likeOne()
    ->where('user_id', $user->id)
    ->first();

// Toggle between like and no interaction
if ($interaction && $interaction->type === InteractionTypeEnum::LIKE) {
    // Remove like
    $interaction->delete();
} else {
    // Add like
    $post->likeTo()->create([
        'user_id' => $user->id,
        'type' => InteractionTypeEnum::LIKE
    ]);
}
```

## Events

The package dispatches Eloquent model events when interactions occur. You can listen for these events in your application:

### Model Events

- `created` - Dispatched when a new interaction is created
- `updated` - Dispatched when an interaction is updated
- `deleted` - Dispatched when an interaction is deleted

### Example: Logging Interactions

You can listen to these events in your `EventServiceProvider`:

```php
use CSlant\LaravelLike\Models\Like;
use Illuminate\Support\Facades\Log;

// In the boot method of EventServiceProvider
Like::created(function ($interaction) {
    Log::info('New interaction created', [
        'user_id' => $interaction->user_id,
        'model_type' => $interaction->model_type,
        'model_id' => $interaction->model_id,
        'type' => $interaction->type->value,
    ]);
});
```

### Example: Updating Cache

You can also use these events to update cached values:

```php
use CSlant\LaravelLike\Models\Like;
use Illuminate\Support\Facades\Cache;

Like::saved(function ($interaction) {
    $cacheKey = "post_{$interaction->model_id}_interactions";
    Cache::forget($cacheKey);
});
```

## Advanced Usage

### Customizing the Interaction Model

You can customize the interaction model by publishing the configuration file and specifying your own model:

```bash
php artisan vendor:publish --tag=like-config
```

Then update the `interaction_model` in the published `config/like.php` file:

```php
'like' => [
    // ...
    'interaction_model' => \App\Models\CustomLike::class,
    // ...
],
```

### Eager Loading

To optimize performance, eager load interactions when querying multiple models:

```php
// Eager load likes count
$posts = Post::withCount(['likesTo as likes_count'])->get();

// Eager load dislikes count
$posts = Post::withCount(['dislikesTo as dislikes_count'])->get();

// Get users who liked a post with their interactions
$post = Post::with(['likesTo.user'])->first();
```

### Querying Interactions

You can query interactions directly using the `Like` model:

```php
use CSlant\LaravelLike\Models\Like;
use CSlant\LaravelLike\Enums\InteractionTypeEnum;

// Get all likes for a specific model type
$likes = Like::where('model_type', Post::class)
    ->where('type', InteractionTypeEnum::LIKE)
    ->get();

// Get all interactions for a specific user
$userInteractions = Like::where('user_id', $user->id)
    ->with('model')
    ->get();
```

## Best Practices

1. **Use Database Transactions**: Wrap interaction operations in database transactions to ensure data consistency
   ```php
   use Illuminate\Support\Facades\DB;
   
   DB::transaction(function () use ($post, $user) {
       // Remove any existing interactions
       $post->forgetInteractions();
       
       // Add new interaction
       $post->likeTo()->create([
           'user_id' => $user->id,
           'type' => \CSlant\LaravelLike\Enums\InteractionTypeEnum::LIKE
       ]);
   });
   ```

2. **Rate Limiting**: Implement rate limiting to prevent abuse of the interaction system
   ```php
   // In your routes/api.php or routes/web.php
   Route::middleware(['throttle:60,1'])->group(function () {
       Route::post('/posts/{post}/like', 'PostController@like');
       Route::post('/posts/{post}/dislike', 'PostController@dislike');
   });
   ```

3. **Caching**: Cache interaction counts for better performance with frequently accessed content
   ```php
   use Illuminate\Support\Facades\Cache;
   
   // In your controller
   $post = Post::find($id);
   
   $likesCount = Cache::remember("post_{$post->id}_likes_count", 3600, function () use ($post) {
       return $post->likesCount();
   });
   ```

4. **Database Indexing**: Ensure proper indexing on the interactions table for better performance
   ```php
   // In a migration file
   public function up()
   {
       Schema::create('likes', function (Blueprint $table) {
           $table->id();
           $table->foreignId('user_id')->constrained()->cascadeOnDelete();
           $table->morphs('model');
           $table->string('type');
           $table->timestamps();

           // Add indexes for better query performance
           $table->index(['model_type', 'model_id']);
           $table->index(['user_id', 'model_type', 'type']);
       });
   }
   ```

## Troubleshooting

### Common Issues

1. **Missing Trait**: Make sure you've added the `HasLike` trait to your model
   ```php
   use CSlant\LaravelLike\HasLike;
   
   class Post extends Model
   {
       use HasLike;
       // ...
   }
   ```

2. **Database Migrations**: Run `php artisan migrate` if you haven't already

3. **Authentication**: Ensure you're properly authenticated when checking for user interactions
   ```php
   // In your controller
   public function like(Post $post)
   {
       if (!auth()->check()) {
           return response()->json(['error' => 'Unauthenticated'], 401);
       }
       // ...
   }
   ```

4. **Publishing Configuration**: If you need to customize the configuration, publish it first:
   ```bash
   php artisan vendor:publish --tag=like-config
   ```

5. **Model Configuration**: Ensure your User model includes the `UserHasInteraction` trait
   ```php
   use CSlant\LaravelLike\UserHasInteraction;
   
   class User extends Authenticatable
   {
       use UserHasInteraction;
       // ...
   }
   ```

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/cs4b1c/laravel-like/issues) on GitHub. When reporting issues, please include:

1. Laravel version
2. Package version
3. Steps to reproduce the issue
4. Any relevant error messages or logs

## Next Steps

1. **Explore More Features**:
   - [Filtering and Sorting by Like Count](./filtering_by_like_count.md)
   - [Using Query Scopes for Advanced Filtering](./query_scopes.md)
   - [Customizing User Interactions](./customizing_user_interaction.md)

2. **Dive Deeper**:
   - [Check if an Item Has Been Interacted With](./check_if_interacted.md)
   - [Working with Interaction Counts](./counting_interactions.md)
   - [Removing and Toggling Interactions](./unliking_content.md)

3. **Advanced Configuration**:
   - [Customizing User Interaction](./customizing_user_interaction.md)
   - [Change Default Interaction](./change_default_interaction.md)

4. **Contribute**:
   - [Report an Issue](https://github.com/cs4b1c/laravel-like/issues)
   - [Contribute Code](https://github.com/cs4b1c/laravel-like/pulls)
   - [View Documentation Source](https://github.com/cs4b1c/laravel-like-docs)
