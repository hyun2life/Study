# QA Daily Report

| Field | Value |
| --- | --- |
| Repository | `example-org/example-repo` |
| Generated at | `2026-05-17T09:00:00+09:00` |
| Total issues | **8** |
| Critical / High | **1 / 1** |
| New today | **2** |
| Updated today | **4** |
| Release blocker candidates | **1** |

## Priority Issues

| Severity | Issue | Category | Owner | Updated | Recommended action |
| --- | --- | --- | --- | --- | --- |
| **Critical** | [#31 Checkout crashes when applying expired coupon](https://github.com/example-org/example-repo/issues/31) | `bug` | dev-lee | 05-17 08:00 | Escalate to owner, reproduce immediately, and block release if confirmed. |
| **High** | [#32 Regression: login redirect loses return URL](https://github.com/example-org/example-repo/issues/32) | `regression` | dev-kang | 05-17 07:00 | Prioritize fix verification and add regression coverage. |

## Release Blocker Candidates

- [#31 Checkout crashes when applying expired coupon](https://github.com/example-org/example-repo/issues/31) - Potential release blocker. Validate reproduction steps and affected scope first. Next: Escalate to owner, reproduce immediately, and block release if confirmed.

## QA Action Items

- [#31 Checkout crashes when applying expired coupon](https://github.com/example-org/example-repo/issues/31): Escalate to owner, reproduce immediately, and block release if confirmed.
- [#32 Regression: login redirect loses return URL](https://github.com/example-org/example-repo/issues/32): Prioritize fix verification and add regression coverage.
- Add or update coverage for [#33 Add tests for password reset token expiration](https://github.com/example-org/example-repo/issues/33), [#37 Add exploratory checklist for subscription upgrade flow](https://github.com/example-org/example-repo/issues/37) before closing related work.
- Review flaky test ownership and stabilization plan for [#34 Search result ordering test is flaky in CI](https://github.com/example-org/example-repo/issues/34).

## Today's Movement

| Type | Count | Issues |
| --- | ---: | --- |
| New today | 2 | [#31 Checkout crashes when applying expired coupon](https://github.com/example-org/example-repo/issues/31), [#37 Add exploratory checklist for subscription upgrade flow](https://github.com/example-org/example-repo/issues/37) |
| Updated today | 4 | [#31 Checkout crashes when applying expired coupon](https://github.com/example-org/example-repo/issues/31), [#32 Regression: login redirect loses return URL](https://github.com/example-org/example-repo/issues/32), [#36 Mobile payment modal is clipped on small screens](https://github.com/example-org/example-repo/issues/36), [#37 Add exploratory checklist for subscription upgrade flow](https://github.com/example-org/example-repo/issues/37) |

## Summary

| Severity | Count |
| --- | ---: |
| Critical | 1 |
| High | 1 |
| Medium | 4 |
| Low | 2 |

| Category | Count |
| --- | ---: |
| `bug` | 2 |
| `documentation` | 1 |
| `enhancement` | 1 |
| `flaky_test` | 1 |
| `regression` | 1 |
| `test_gap` | 2 |

## Issue Matrix

| Severity | Issue | Category | Labels | Owner | Milestone |
| --- | --- | --- | --- | --- | --- |
| **Critical** | [#31 Checkout crashes when applying expired coupon](https://github.com/example-org/example-repo/issues/31) | `bug` | `bug`, `checkout`, `p0`, `release-blocker` | dev-lee | May Release |
| **High** | [#32 Regression: login redirect loses return URL](https://github.com/example-org/example-repo/issues/32) | `regression` | `regression`, `auth`, `p1` | dev-kang | May Release |
| **Medium** | [#33 Add tests for password reset token expiration](https://github.com/example-org/example-repo/issues/33) | `test_gap` | `test-gap`, `auth` | qa-park | Test Hardening |
| **Medium** | [#34 Search result ordering test is flaky in CI](https://github.com/example-org/example-repo/issues/34) | `flaky_test` | `flaky-test`, `ci` | qa-kim, dev-yoon | Test Hardening |
| **Low** | [#35 Update release checklist documentation](https://github.com/example-org/example-repo/issues/35) | `documentation` | `docs`, `process` | qa-min | Process |
| **Medium** | [#36 Mobile payment modal is clipped on small screens](https://github.com/example-org/example-repo/issues/36) | `bug` | `bug`, `mobile`, `p2` | dev-han | May Release |
| **Medium** | [#37 Add exploratory checklist for subscription upgrade flow](https://github.com/example-org/example-repo/issues/37) | `test_gap` | `test-gap`, `billing` | qa-seo | Test Hardening |
| **Low** | [#38 Improve empty-state copy for failed search](https://github.com/example-org/example-repo/issues/38) | `enhancement` | `enhancement`, `ux` | pm-choi | Backlog |
