---
title: Configuration Laravel Like
description: All configuration for Laravel Like package to get started with it. Create interactions, set up the environment, and get the package ready for use.
keywords: ["laravel Laravel Like", "configuration", "Laravel Like configuration", 'get started', 'Laravel Like get started']
tags: ["Configuration", "Get Started", "Laravel Like Configuration", "Create Interactions", "Environment Setup", "Laravel Like Package", "Likes", "Dislikes", "Favorites", "Stars", "Upvotes", "Downvotes", "Reactions", "Votes"]
---

# 🛠 Configuration

Here is the default configuration for Laravel Like package. You can customize the configuration as per your requirements.

## Configuration file

Path: `config/like.php`

```php title="config/like.php"
return [
    /*
     * The flag to determine if the interactions table should use UUIDs.
     * If you want to use UUIDs instead of auto-incrementing integers
     * for your interactions table, set this to true.
     */
    'is_uuids' => false,

    /*
     * The table name for interaction records.
     */
    'table_name' => 'likes',

    /*
     * The model class for the interaction table.
     */
    'interaction_model' => 'CSlant\LaravelLike\Models\Like',

    /*
     * The model and foreign key for the user relationship.
     */
    'users' => [
        /*
         * User model class.
         * When null, the package falls back to
         * config('auth.providers.users.model') automatically.
         */
        'model' => null,

        /*
         * User tables foreign key name.
         * Use this to set the foreign key name for the user relationship.
         */
        'foreign_key' => 'user_id',
    ],
];
```

:::warning Note

If you want to change the configuration, you can publish the configuration file in **[the installation step](./installation)**.

And if you have already run the migration, **you need to roll back the migration and _run it again to apply the changes_**.

```shell
php artisan migrate:rollback
```
:::

If you have rolled back the migration, please follow the modification instructions below to customize it to suit your project.

---

## Configuration options

### `is_uuids`

Use UUIDs instead of auto-incrementing integers for the `id` column in the `likes` table.

```php
'is_uuids' => true,
```

**What happens when enabled:**

- The migration uses `uuid('id')->primary()` instead of `id()`
- Morph columns use `uuid` instead of the default `integer`
- The `CSlant\LaravelLike\Models\Like` model automatically generates UUIDs on insert
- No additional model changes are required — the behaviour is config-driven

**When to use it:** choose `is_uuids` if you have non-sequential IDs in your application or are running on a database (like CouchDB or MongoDB via a driver) that doesn't support auto-incrementing integers.

:::danger Important

After changing `is_uuids`, you **must** rollback and re-run your migrations. You also need to migrate any existing data manually — the package does not handle this for you.

:::

---

### `table_name`

Customise the interactions table name:

```php
'table_name' => 'interactions',
```

Make sure to re-run the migration after changing this value.

---

### `interaction_model`

Specify a custom interaction model to replace the default `CSlant\LaravelLike\Models\Like` class. Your custom model must extend the default one:

```php
'interaction_model' => \App\Models\CustomLike::class,
```

```php
namespace App\Models;

use CSlant\LaravelLike\Models\Like;

class CustomLike extends Like
{
    // Add custom relationships, attributes, or casts
}
```

This is useful if you want to add extra columns (via a separate migration), custom relationships, or additional logic to each interaction record.

---

### `users.model`

Set the user model class. When `null` (the default), the package automatically resolves the model from `config('auth.providers.users.model')` — the standard Laravel auth user model.

```php
'users' => [
    'model' => null, // Falls back to auth()->user() model
],
```

Change this only if your User model lives in a different namespace:

```php
'users' => [
    'model' => \App\Modules\User\CustomUser::class,
],
```

---

### `users.foreign_key`

If your `likes` table uses a different column name for the user foreign key, update this:

```php
'users' => [
    'foreign_key' => 'author_id',
],
```

Make sure the migration table uses the same column name.

---

## Re-run the migration

After you have made any changes to the configuration file, you need to re-run the migration to apply them:

```shell
php artisan migrate:rollback
php artisan migrate
```

That's it! You have successfully configured the Laravel Like package.