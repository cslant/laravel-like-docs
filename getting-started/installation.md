---
title: Installation | Laravel Laravel Like
description: Installation instructions for Laravel Like package. Install the package via composer, publish the config file, and migrate the database.
keywords: ["Laravel Like", "installation", "install Laravel Like", 'get started', 'Laravel Like get started', 'composer', 'publish config', 'migrate database']
tags: ["Installation", "Get Started", "Composer", "Publish Config", "Laravel Like", "Migrate Database", "Laravel Like Installation", "Interactions", "Likes", "Dislikes", "Favorites", "Stars", "Upvotes", "Downvotes", "Reactions", "Votes", "Laravel Like Package"]
---

<head>
  <meta name="robots" content="index,follow" />
  <meta name="author" content="CSlant" />
</head>

# 🔧 Installation

Please read carefully the instructions below and follow them step by step.

## Install the package

You can **install the package via composer**:

```bash
composer require cslant/laravel-like
```

The package will automatically register its service provider.

## Configuration

:::danger[required]

**_This is a required step. Please don't skip it._**

:::

You can publish all the necessary configuration and migration files by running the following command:

```shell
php artisan vendor:publish --provider="CSlant\LaravelLike\LikeServiceProvider"
```

## Migrate the database

After the configuration file has been published, you can run the migration:

```shell
php artisan migrate
```

The migration will create a `likes` table in your database. This table will store all the likes.

That's it! You have successfully installed the Laravel Like package. 🎉

---

This is the default content of the config file:

```php
return [
    'name' => 'The interactions configuration',

    /*
     * The flag to determine if the interactions table should use UUIDs.
     * If you want to use UUIDs instead of auto-incrementing integers for your interactions table, set this to true.
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
         * Use this to set the user model class for the user relationship.
         */
        'model' => 'App\Models\User',

        /*
         * User tables foreign key name.
         * Use this to set the foreign key name for the user relationship.
         */
        'foreign_key' => 'user_id',
    ],
];
```