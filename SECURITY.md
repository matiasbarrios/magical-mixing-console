# Security policy

## Supported versions

This is an open-source project provided **as-is**, without warranty or commercial support. Security fixes are handled on a best-effort basis.

| Version | Supported |
| ------- | --------- |
| Latest release on `main` | Yes |
| Older tags / forks | No |

## Reporting a vulnerability

**Please do not open a public Issue** for security-sensitive reports.

Use one of these channels:

1. **[GitHub Security Advisories](https://github.com/matiasbarrios/magical-mixing-console/security/advisories/new)** (preferred) — private report and coordinated disclosure.
2. **Email:** matias@magicalmixingconsole.com — subject line `MMC security`.

Include:

- Description of the issue and impact
- Steps to reproduce (if applicable)
- Affected platform (Electron, Capacitor, mixers library)
- Version or commit SHA

We aim to acknowledge reports within a reasonable time. Response depth depends on maintainer availability.

## Out of scope

The following are generally **not** treated as vulnerabilities in this project:

- Issues that require physical or LAN access to the operator's network and mixer
- Misconfiguration of local Wi‑Fi or firewall by the user
- Forks that ship under a different app id, name, or signing identity
- Third-party dependencies — report upstream; we will bump versions when appropriate
- Social engineering or trademark disputes

MMC controls mixers over the **local network** using OSC/UDP. It does not collect usage data. Threat models should assume LAN-trusted or LAN-segmented deployment.

## Safe disclosure

We appreciate responsible disclosure. Reporters will be credited in the advisory when they wish to be.
