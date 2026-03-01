# Contributing to Laravel Like

Thank you for your interest in contributing to Laravel Like! We welcome all contributions, whether they're bug reports, feature requests, or pull requests.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [License](#license)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check if the issue has already been reported in the [issues section](https://github.com/cslant/laravel-like/issues). When creating a bug report, please include:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs. actual behavior
- Any relevant error messages or logs
- Your environment (PHP version, Laravel version, package version)

### Suggesting Enhancements

We welcome suggestions for new features and improvements. Please:

1. Check if a similar feature request already exists
2. Explain why this enhancement would be useful
3. Provide examples of how the feature would be used

### Your First Code Contribution

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
   ```bash
   git clone git@github.com:your-username/laravel-like.git
   cd laravel-like
   ```
3. **Set up the development environment** (see [Development Setup](#development-setup))
4. **Create a new branch** for your changes
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. **Make your changes** and commit them
6. **Push your changes** to your fork
   ```bash
   git push -u origin feature/your-feature-name
   ```
7. **Open a pull request** from your fork to the main repository

### Pull Requests

When submitting a pull request:

1. Ensure your code follows the [coding standards](#coding-standards)
2. Update the documentation to reflect your changes
3. Add tests for new features or bug fixes
4. Ensure all tests pass
5. Reference any related issues
6. Keep your pull request focused on a single feature or fix

## Development Setup

1. **Clone the repository**
   ```bash
   git clone git@github.com:cslant/laravel-like.git
   cd laravel-like
   ```

2. **Install dependencies**
   ```bash
   composer install
   ```

3. **Set up the test environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Run the tests**
   ```bash
   composer test
   ```

## Coding Standards

- Follow [PSR-12](https://www.php-fig.org/psr/psr-12/) coding standards
- Use type hints and return type declarations where possible
- Add docblocks for all classes, methods, and properties
- Keep methods small and focused on a single responsibility
- Write self-documenting code with meaningful variable and method names

## Testing

We use PHPUnit for testing. To run the tests:

```bash
composer test
```

When adding new features or fixing bugs, please include tests that cover your changes.

## Documentation

Good documentation is crucial for any open-source project. When making changes that affect functionality:

1. Update the relevant documentation
2. Add examples of how to use new features
3. Document any breaking changes

## License

By contributing to Laravel Like, you agree that your contributions will be licensed under the [MIT License](LICENSE).
