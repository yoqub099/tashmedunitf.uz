# Security Policy

## Supported Versions

Only the **`main`** branch is actively maintained and receives security updates.

## Reporting a Vulnerability

If you discover a security vulnerability, please **DO NOT** open a public issue.

Instead, email: **security@tashmedunitf.uz** (or contact the tech lead directly).

Include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Suggested remediation (if any)

We will:
- Acknowledge within 48 hours
- Provide a timeline for the fix
- Credit you (if desired) in the fix release

## Security Best Practices

### Secrets management

- **NEVER** commit `.env`, `.env.local`, `.env.production`
- **NEVER** commit `.sql`, `.dump`, `.token`, `.pem`, `.key` files
- Use a secrets manager (Doppler / Vault / AWS Secrets Manager)
- Rotate credentials at least quarterly
- Enable 2FA for all admin accounts

### Code review

- All PRs require at least 1 approving review
- Security-sensitive changes (auth, payments, file uploads) require 2 approvers
- Dependabot/Snyk alerts must be addressed within 7 days

### Deployment

- Production deploys are gated by manual approval
- All secrets injected from GitHub Secrets (not committed)
- HTTPS-only with HSTS preload
- Sanctum tokens have explicit expiration

### Known threat model

See [docs/security/threat-model.md](./docs/security/threat-model.md).

## Disclosure Timeline

We follow **responsible disclosure**:
1. Vulnerability reported privately
2. Acknowledged within 48 hours
3. Fix developed + tested
4. Fix deployed to production
5. Public disclosure (90 days after fix, or sooner if mutually agreed)

For more details, see [docs/security/](./docs/security/).
