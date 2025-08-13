---
title: Introduction | Laravel Like
description: A comprehensive Laravel package for adding like, dislike, and love interactions to your Eloquent models with ease.
keywords: ['laravel like', 'interactions', 'social features', 'likes', 'dislikes', 'loves', 'laravel package', 'eloquent', 'social engagement']
tags: ['Introduction', 'Features', 'Installation', 'Configuration', 'Usage', 'API', 'Examples', 'Laravel Package']
image: /images/laravel-like-docs-thumb.webp
---

<head>
  <meta name="robots" content="index,follow" />
  <meta name="author" content="CSlant" />
</head>

# Laravel Like Package

A powerful and flexible Laravel package that adds social interaction features to your Eloquent models with minimal setup. 

![Laravel Like Package](/images/laravel-like-thumb.webp)

## ✨ Features

- **Multiple Interaction Types**: Support for likes, dislikes, and loves out of the box
- **Fully Extensible**: Easily add custom interaction types
- **Efficient Queries**: Optimized database queries for high performance
- **Polymorphic Relationships**: Works with any Eloquent model
- **Flexible Configuration**: Customize table names, model references, and more
- **Comprehensive API**: Simple, intuitive methods for all interaction types
- **Query Scopes**: Powerful filtering and sorting capabilities
- **UUID Support**: Optional UUID support for primary keys
- **Caching**: Built-in caching for better performance
- **Event-Driven**: Fires events for all interactions

## 🚀 Getting Started

### Requirements

- PHP 8.1 or higher
- Laravel 9.0 or higher
- Composer

### Installation

1. Install the package via Composer:

```bash
composer require cslant/laravel-like
```

2. Publish the configuration file and migrations:

```bash
php artisan vendor:publish --provider="CSlant\LaravelLike\Providers\LikeServiceProvider"
```

3. Run the migrations:

```bash
php artisan migrate
```

## 🔧 Configuration

The package comes with sensible defaults, but you can customize its behavior by modifying the `config/like.php` file. Key configuration options include:

- `is_uuids`: Use UUIDs instead of auto-incrementing IDs
- `table_name`: Customize the interactions table name
- `interaction_model`: Specify a custom interaction model
- `users.model`: Configure the user model
- `users.foreign_key`: Set the user foreign key

## 📚 Documentation

Explore the comprehensive documentation to get the most out of Laravel Like:

- [Basic Usage](usage/liking_content.md) - Learn how to add interactions to your models
- [Checking Interactions](usage/check_if_interacted.md) - Determine if users have interacted with content
- [Counting Interactions](usage/counting_interactions.md) - Get interaction counts and statistics
- [Query Scopes](usage/query_scopes.md) - Filter and sort content by interaction data
- [Advanced Usage](usage/advanced_usage.md) - Custom interaction types and advanced features

## 🤝 Contributing

Contributions are welcome! Please see our [contributing guide](https://github.com/cslant/laravel-like/blob/main/CONTRIBUTING.md) for details.

## 📄 License

This package is open-sourced software licensed under the [MIT License](https://opensource.org/licenses/MIT).

## 🔗 Links

- [GitHub Repository](https://github.com/cslant/laravel-like)
- [Issues](https://github.com/cslant/laravel-like/issues)
- [Changelog](prologue/releases)

## 📊 Stats

<p align="center">
  <a href="https://github.com/cslant/laravel-like?tab=MIT-1-ov-file">
    <img src="https://img.shields.io/github/license/cslant/laravel-like.svg?style=flat-square" alt="License" />
  </a>
  <a href="https://github.com/cslant/laravel-like/releases">
    <img src="https://img.shields.io/github/release/cslant/laravel-like.svg?style=flat-square" alt="Latest Version" />
  </a>
  <a href="https://packagist.org/packages/cslant/laravel-like">
    <img src="https://img.shields.io/packagist/dt/cslant/laravel-like.svg?style=flat-square" alt="Total Downloads" />
  </a>
  <a href="https://github.com/cslant/laravel-like/actions/workflows/setup_test.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/cslant/laravel-like/setup_test.yml?label=tests&branch=main" alt="Test Status" />
  </a>
  <a href="https://github.com/cslant/laravel-like/actions/workflows/php-cs-fixer.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/cslant/laravel-like/php-cs-fixer.yml?label=code%20style&branch=main" alt="Code Style Status" />
  </a>
  <a href="https://scrutinizer-ci.com/g/cslant/laravel-like">
    <img src="https://img.shields.io/scrutinizer/g/cslant/laravel-like.svg?style=flat-square" alt="Quality Score" />
  </a>
</p>
