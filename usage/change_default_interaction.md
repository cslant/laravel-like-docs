---
title: Change the default interaction model | Laravel Like
description: Change the default interaction model for Laravel Like package. Change the default interaction model for Laravel Like package to customize the interactions as per your requirements.
keywords: ['laravel like', 'change default interaction model', 'interaction model', 'default interaction model', 'customize interactions', 'Laravel Like interaction model']
tags: ['Change Default Interaction Model', 'Interaction Model', 'Customize Interactions', 'Laravel Like Interaction Model', 'Laravel Like Package', 'Update Interaction Model', 'Usage', 'Laravel Like Usage']
---

<head>
  <meta name="robots" content="index,follow" />
  <meta name="author" content="CSlant" />
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
