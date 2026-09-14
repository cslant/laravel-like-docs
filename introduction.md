---
title: Introduction | Laravel Like
description: A comprehensive Laravel package for adding like, dislike, and love interactions to your Eloquent models with ease.
keywords: ['laravel like', 'interactions', 'social features', 'likes', 'dislikes', 'loves', 'laravel package', 'eloquent', 'social engagement']
tags: ['Introduction', 'Features', 'Installation', 'Configuration', 'Usage', 'API', 'Examples', 'Laravel Package']
image: /images/laravel-like-docs-thumb.webp
---

# Laravel Like Package

A powerful and flexible Laravel package that adds social interaction features to your Eloquent models with minimal setup.

![Laravel Like Package](/images/laravel-like-thumb.webp)

## ✨ Features

- **Multiple Interaction Types** — like, dislike, and love out of the box
- **Facade & Service API** — `Like::like($post)` plus a full `LikeManager` behind a singleton contract
- **Single-active invariant** — one interaction type per user per model, enforced transactionally
- **Idempotent actions** — calling `like()` twice returns the same row, never duplicates
- **Polymorphic relationships** — works with any Eloquent model
- **UUID primary keys** — optional, driven by config
- **Strict counting** — single `COUNT` / `EXISTS` queries, never N+1
- **Rich model helpers** — `isLiked()`, `likesCount()`, `toggle()`, and more
- **Batch APIs for lists** — `likeCountsFor()` and `userInteractionsFor()` resolve counts/state for a whole `Collection` in one query per model type, instead of one query per row
- **Built-in count caching** — optional, config-driven cache for `likesCount()` / `dislikesCount()` / `lovesCount()`, auto-invalidated on every write
- **Indexed by default** — a composite index on `(model_type, model_id, type)` ships alongside the standard migration
- **Eloquent event hooks** — listen to `Like::created`, `Like::deleted` etc. for your own custom caches

## 🚀 Getting Started

### Requirements

- PHP **8.2** or higher (8.2 – 8.5)
- Laravel **11, 12, or 13**
- [Composer](https://getcomposer.org/)

### Installation

```bash
composer require cslant/laravel-like
```

```bash
php artisan vendor:publish --provider="CSlant\LaravelLike\Providers\LikeServiceProvider"
```

```bash
php artisan migrate
```

## 🔧 Configuration

All configuration lives in `config/like.php`. Key options:

| Key | Default | Purpose |
| --- | --- | --- |
| `is_uuids` | `false` | Use UUID primary keys instead of auto-incrementing integers |
| `table_name` | `'likes'` | Database table name |
| `interaction_model` | `Like::class` | Replace with your own model (extends `Like`) |
| `users.model` | `null` (falls back to auth user) | Your User model class |
| `users.foreign_key` | `'user_id'` | Column name for the user foreign key |
| `cache.enabled` | `false` | Cache `likesCount()` / `dislikesCount()` / `lovesCount()`, auto-invalidated on writes |
| `cache.ttl` | `60` | Seconds before a cached count expires (safety net; writes invalidate immediately) |

## 📚 Documentation

Explore the comprehensive documentation:

**Getting Started**
- [Requirements](getting-started/requirements.md)
- [Installation](getting-started/installation.md)
- [Configuration](getting-started/configuration.md)

**Usage**
- [Liking Content](usage/liking_content.md) — `like()`, `dislike()`, `love()`
- [Unliking Content](usage/unliking_content.md) — `unlike()`, `unDislike()`, `unlove()`, `forgetInteractions()`
- [Checking Interactions](usage/check_if_interacted.md) — `isLiked()`, `isLikedBy()`, `isInteractedBy()`
- [Toggle Interactions](usage/toggle_interactions.md) — `toggle()` state machine
- [User Interaction Trait](usage/user_interaction_trait.md) — the user-side `likes()` relationship
- [Counting Interactions](usage/counting_interactions.md) — `likesCount()`, `totalCount()`
- [Query Scopes](usage/query_scopes.md) — building queries with real package relations
- [Filtering by Count](usage/filtering_by_like_count.md) — popularity sorting
- [Customizing User Interaction](usage/customizing_user_interaction.md) — extend models
- [LikeManager & Facade API](usage/like_manager.md) — full service reference
- [Performance](usage/performance.md) — query-cost guarantees and caching

## 🤝 Contributing

Contributions are welcome! Please see our [contributing guide](https://github.com/cslant/laravel-like/blob/main/CONTRIBUTING.md) for details.

## 📄 License

This package is open-sourced software licensed under the [MIT License](https://opensource.org/licenses/MIT).

## 🔗 Links

- [GitHub Repository](https://github.com/cslant/laravel-like)
- [Issues](https://github.com/cslant/laravel-like/issues)
- [Changelog](prologue/releases)