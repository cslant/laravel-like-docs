---
title: Change the default interaction model | Laravel Like
description: Change the default interaction model for Laravel Like package. Change the default interaction model for Laravel Like package to customize the interactions as per your requirements.
tags: ['Change Default Interaction Model', 'Interaction Model', 'Customize Interactions', 'Laravel Like Interaction Model', 'Laravel Like Package', 'Update Interaction Model', 'Usage', 'Laravel Like Usage']
---

<head>
  <meta name="robots" content="index,follow" />
  <meta name="author" content="CSlant" />
  <meta name="generator" content="Docusaurus" />
  <meta name="theme-color" content="#2e8555" />
  
  <link rel="canonical" href="https://docs.cslant.com/laravel-like/usage/change_default_interaction" />
  
  <meta property="og:title" content="Change the default interaction model | Laravel Like" />
  <meta property="og:description" content="Change the default interaction model for Laravel Like package. Change the default interaction model for Laravel Like package to customize the interactions as..." />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://docs.cslant.com/laravel-like/usage/change_default_interaction" />
  <meta property="og:site_name" content="Laravel Like Package Documentation" />
  <meta property="og:locale" content="en_US" />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Change the default interaction model | Laravel Like" />
  <meta name="twitter:description" content="Change the default interaction model for Laravel Like package. Change the default interaction model for Laravel Like package to customize the interactions as..." />
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

# 🛠 Change Default Interaction Model

Here is the default interaction model for Laravel Like package. You can customize the interaction model as per your requirements.

Path: `config/like.php`

```php
'interaction_model' => \CSlant\LaravelLike\Models\Like::class,
```

Sometimes, you may want to change the default interaction model to customize the interactions as per your requirements. You can change the default interaction model by updating the `interaction_model` key in the `config/like.php` file.

**Here is how you can change the default interaction model:**

```php
'interaction_model' => \App\Models\CustomInteraction::class,
```

And in the `CustomInteraction` model, you need to extend the `CSlant\LaravelLike\Models\Like` model.

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use CSlant\LaravelLike\Models\Like;

class CustomInteraction extends Like
{
    // Define your custom interactions here
}
```

In the above example, we have changed the default interaction model to `CustomInteraction` model. You can replace `CustomInteraction` with your custom interaction model.
