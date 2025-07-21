---
title: Configuration Laravel Like
description: All configuration for Laravel Like package to get started with it. Create interactions, set up the environment, and get the package ready for use.
tags: ["Configuration", "Get Started", "Laravel Like Configuration", "Create Interactions", "Environment Setup", "Laravel Like Package", "Likes", "Dislikes", "Favorites", "Stars", "Upvotes", "Downvotes", "Reactions", "Votes"]
---

<head>
  <meta name="robots" content="index,follow" />
  <meta name="author" content="CSlant" />
  <meta name="generator" content="Docusaurus" />
  <meta name="theme-color" content="#2e8555" />
  
  <link rel="canonical" href="https://docs.cslant.com/laravel-like/getting-started/configuration" />
  
  <meta property="og:title" content="Configuration Laravel Like" />
  <meta property="og:description" content="All configuration for Laravel Like package to get started with it. Create interactions, set up the environment, and get the package ready for use." />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://docs.cslant.com/laravel-like/getting-started/configuration" />
  <meta property="og:site_name" content="Laravel Like Package Documentation" />
  <meta property="og:locale" content="en_US" />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Configuration Laravel Like" />
  <meta name="twitter:description" content="All configuration for Laravel Like package to get started with it. Create interactions, set up the environment, and get the package ready for use." />
  <meta name="twitter:creator" content="@cslantofficial" />
  <meta name="twitter:site" content="@cslantofficial" />
  
  <meta name="format-detection" content="telephone=no" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  
  <meta property="article:published_time" content="2025-07-21T00:00:00Z" />
  <meta property="article:modified_time" content="2025-07-21T00:00:00Z" />
  <meta property="article:author" content="CSlant" />
  <meta property="article:section" content="Documentation" />
  
  </head>

# 🛠 Configuration

Here is the default configuration for Laravel Like package. You can customize the configuration as per your requirements.

## Configuration file

Path: `config/like.php`

```php title="config/like.php"
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

:::warning Note

If you want to change the configuration, you can publish the configuration file in **[the installation step](/laravel-like/getting-started/installation#configuration).**

And if you have already run the migration, **you need rollback the migration and _run it again to apply the changes_**.

```shell
php artisan migrate:rollback
```
:::

If you have rolled back the migration, please handle follow to the modification instructions below to customize it to suit your project.

## Change the table name

You can change the table name for interaction records by updating the `table_name` key in the configuration file.

```php
'table_name' => 'interactions',
```

So now, the interactions table will be named `interactions`.

## Use UUIDs for interactions

If you want to use UUIDs instead of auto-incrementing integers for your interactions table, set the `is_uuids` key to `true`.

```php
'is_uuids' => true,
```

## Change the user model

Sometimes, you may want to use a different user model for the interactions. 

Maybe you are using a **modular structure**, or using **another pattern like DDD(Domain-Driven Design)**. That's why you can change the user model class in the configuration file. You can **skip this step** if you are using the default Laravel user model.

Now, update the `model` key in the `users` array to set the user model class.

```php
'user' => [
    'model' => \App\Modules\User\CustomUser::class, // Custom the user model class
],
```

:::info Explanation
- `\App\Modules\User\CustomUser::class` is the custom user model class.
- You can replace `CustomUser` with your custom user model class.
:::

## Change the foreign key

If you are using a different foreign key for the user relationship, you can update the `foreign_key` key in the `users` array.

```php
'user' => [
    'foreign_key' => 'customer_id', // Custom foreign key name for the user relationship
],
```

:::info Explanation
- `customer_id` is the custom foreign key name for the user relationship.
:::

## Re-run the migration

After you have made the changes to the configuration file, you need to re-run the migration to apply the changes.

```shell
php artisan migrate
```

That's it! You have successfully configured the Laravel Like package. 🎉
