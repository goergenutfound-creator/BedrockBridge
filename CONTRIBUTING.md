# Contributing to BedrockBridge

Thanks for wanting to contribute! Please follow these guidelines to make your contributions high-quality and easy to review.

Code style
- TypeScript for all server and SDK code.
- Strict typing: "strict" compiler option enabled.
- Use ESLint with recommended rules and Prettier for formatting.

Commits and PRs
- Use Conventional Commits for commit messages (e.g., feat:, fix:, docs:, chore:).
- Open a GitHub issue for non-trivial features or bugs before starting work.
- One feature per PR. Keep PRs small and focused.

Testing
- Unit tests are required for all new code. Use Jest.
- Integration tests for critical flows (BP handshake, command lifecycle).
- Tests must be deterministic and not rely on external services unless mocked.

Documentation
- Document every public interface and exported function/class.
- Update docs/ when making protocol or API changes.

Review process
- Assign at least one maintainer for review. Maintain a list of core maintainers in MAINTAINERS.md in future.

Security
- Do not commit secrets or private keys. Use environment variables or a secrets manager for CI.
- Report security issues privately to repo maintainers (email or GitHub Security Advisories).

