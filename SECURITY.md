# Security Policy

## Supported Versions

We provide security updates for the following versions of Laravel Like:

| Version | Supported          |
| ------- | ------------------ |
| 2.x     | :white_check_mark: |
| 1.x     | :x:                |
| < 1.0   | :x:                |

## Reporting a Vulnerability

### How to Report a Security Vulnerability

We take security issues in Laravel Like seriously. We appreciate your efforts to responsibly disclose your findings, and we'll make every effort to acknowledge your contributions.

To report a security vulnerability, please email [security@cslant.com](mailto:security@cslant.com) with the subject line "[Laravel Like] Security Vulnerability".

Please include the following details in your report:
- A description of the vulnerability
- Steps to reproduce the issue
- The version of Laravel Like you're using
- Any potential impact of the vulnerability
- Your name/handle for credit (optional)

### Our Security Process

1. Upon receiving a security report, we will acknowledge receipt within 48 hours.
2. We will investigate the issue and confirm the vulnerability.
3. We will work on a fix and test it thoroughly.
4. Once the fix is ready, we will release a new version with the security patch.
5. We will publish a security advisory detailing the vulnerability and the fix.

### Public Disclosure

We follow responsible disclosure practices:
- We will notify you when we've received your report
- We'll keep you informed of our progress
- We'll coordinate public disclosure with you
- We'll credit you for the discovery (unless you prefer to remain anonymous)

### Bug Bounty

Currently, we don't have a formal bug bounty program, but we're happy to publicly thank you for your contribution and may offer other forms of recognition for significant security reports.

## Best Practices

To help keep your Laravel Like installation secure, please follow these best practices:

1. **Keep your dependencies up to date**
   ```bash
   composer update cslant/laravel-like
   ```

2. **Review your dependencies regularly**
   ```bash
   composer audit
   ```

3. **Follow Laravel's security best practices**
   - Keep Laravel updated
   - Use HTTPS
   - Secure your database connections
   - Use proper authentication and authorization

4. **Stay informed**
   - Subscribe to Laravel's security announcements
   - Follow our [GitHub repository](https://github.com/cslant/laravel-like) for updates

## Security Considerations

When using Laravel Like, please be aware of the following security considerations:

1. **User Authentication**: Ensure that all routes that modify likes/dislikes are properly authenticated.
2. **Rate Limiting**: Consider implementing rate limiting on like/dislike endpoints to prevent abuse.
3. **Validation**: Always validate input data before processing it.
4. **CSRF Protection**: Laravel's built-in CSRF protection is enabled by default for all web routes.

## Contact

For any security-related questions or concerns, please contact us at [security@cslant.com](mailto:security@cslant.com).

## Credits

We would like to thank all the security researchers and community members who have helped make Laravel Like more secure.
