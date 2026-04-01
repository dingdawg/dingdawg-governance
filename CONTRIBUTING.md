# Contributing to DingDawg Governance

Thank you for your interest in contributing. The client packages in this repo are intentionally thin — all governance intelligence runs server-side. PRs that keep the client light and dependency-free are prioritized.

---

## What We Accept

- Bug fixes in `packages/`
- Documentation improvements in `docs/`
- New MCP tool wrappers that call existing governance API endpoints
- Test coverage improvements

## What We Don't Accept

- Changes that add business logic to the client packages
- New external dependencies without prior discussion
- Changes to the API layer (that's server-side infrastructure)

---

## Getting Started

1. Fork the repo and create a branch from `main`.
2. Install dependencies:
   ```bash
   cd packages/mcp-server
   npm install
   ```
3. Make your changes and ensure existing tests pass:
   ```bash
   npm test
   ```
4. Open a pull request against `main`. Include a clear description of what you changed and why.

---

## Code Style

- TypeScript with strict mode enabled
- No `any` types without a comment explaining why
- Functions under 40 lines where possible
- Tests for any new public function

---

## Reporting Issues

Open a GitHub issue with:
- Your OS and Node.js version
- The MCP client you're using (Claude Code, Cursor, Codex, etc.)
- Steps to reproduce
- Expected vs actual behavior

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
