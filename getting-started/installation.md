---
title: Installation | Laravel Like
description: Installation instructions for Laravel Like package. Install the package via composer, publish the config file, and migrate the database.
keywords: ["Laravel Like", "installation", "install Laravel Like", 'get started', 'Laravel Like get started', 'composer', 'publish config', 'migrate database']
tags: ["Installation", "Get Started", "Composer", "Publish Config", "Laravel Like", "Migrate Database", "Laravel Like Installation", "Interactions", "Likes", "Dislikes", "Favorites", "Stars", "Upvotes", "Downvotes", "Reactions", "Votes", "Laravel Like Package", "Import Trait", "User Model", "Model"]
---

# 🔧 Installation

Please read carefully the instructions below and follow them step by step.

## 1. Install the package

You can **install the package via Composer**:

```bash
composer require cslant/laravel-like
```

The package will register its `CSlant\LaravelLike\Providers\LikeServiceProvider` automatically via package auto-discovery.

## 2. Publish the configuration and migration files

:::danger[required]

**_This is a required step. Please don't skip it._**

:::

```shell
php artisan vendor:publish --provider="CSlant\LaravelLike\Providers\LikeServiceProvider"
```

This publishes two things:

1. `config/like.php` — the package configuration file
2. `database/migrations/<timestamp>_create_likes_table.php` — the migration for the interactions table

You can also publish them separately:

```shell
php artisan vendor:publish --provider="CSlant\LaravelLike\Providers\LikeServiceProvider" --tag=config
php artisan vendor:publish --provider="CSlant\LaravelLike\Providers\LikeServiceProvider" --tag=migrations
```

:::tip[Everything configurable]

See the **[configuration page](./configuration)** for every available option (`is_uuids`, `table_name`, `interaction_model`, `users.model`, `users.foreign_key`).

:::

## 3. Run the migration

After the configuration file has been published, run the migration:

```shell
php artisan migrate
```

The migration creates a single `likes` table that stores **all** interactions (likes, dislikes, loves) for **all** interactable models through a polymorphic `model` column pair.

> **Table structure:** `id`, `model_id`, `model_type` (polymorphic morphs), `user_id`, `type`, `created_at`, `updated_at`, with a unique constraint on `(user_id, model_id, model_type, type)`.

## 4. Add the trait to your content model

Add the `HasLike` trait to any model you want to make interactable. This provides like **and** dislike functionality.

```php
namespace App\Models;

use CSlant\LaravelLike\HasLike;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasLike;

    // Your model code here
}
```

If you only need the love ❤️ surface, use `HasLove` instead (or in addition):

```php
use CSlant\LaravelLike\HasLove;

class Post extends Model
{
    use HasLike;
    use HasLove;

    // Now supports: like, dislike AND love
}
```

:::warning[Do not add UserHasInteraction to a HasLike/HasLove model]

`UserHasInteraction` is meant for the **User** model. It defines a `likes()` **hasMany** relationship, which collides with the `likes()` **morphMany** relationship defined by `HasLike`/`HasLove`. Never compose `UserHasInteraction` together with `HasLike` or `HasLove` on the same model.

:::

## 5. Add the trait to your User model

To let the authenticated user interact (and to fetch their interactions), add the `UserHasInteraction` trait to your `User` model:

```php
namespace App\Models;

use CSlant\LaravelLike\UserHasInteraction;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use UserHasInteraction;

    // Your model code here
}
```

`UserHasInteraction` adds:

- `likes()` — a `HasMany` relationship with all the user's interactions (likes, dislikes, loves)
- `forgetInteractions()` / `forgetInteractionsOfType()` — bulk-delete the user's interactions

## 6. Optional: register the facade

The `Like` and `Love` facades are usable out of the box via their full class name:

```php
use CSlant\LaravelLike\Facades\Like;

Like::like($post);
```

Everything works without registering anything extra. If you want shorter aliases, add them to the `aliases` array in `config/app.php`:

```php
'aliases' => [
    // ...
    'Like' => \CSlant\LaravelLike\Facades\Like::class,
],
```

## Done 🎉

That's it! You have successfully installed the Laravel Like package. Now head over to:

- [Liking content](../usage/liking_content) to create your first interaction
- [The LikeManager & Facade API](../usage/like_manager) for the full API reference
- [Performance](../usage/performance) to keep your queries fast