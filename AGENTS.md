# Agent rules (tech-demos monorepo)

- **Scope**: Edit only `apps/<slug>/` for demo apps. Root scaffold files (`AGENTS.md`, `skills/`, `tracking/`, root `package.json`, `README.md`, `.gitignore`) are allowed when bootstrapping or updating shared tooling.
- **Runtime**: Use [Bun](https://bun.sh) for install, scripts, and local servers. Do not add npm/yarn/pnpm as the primary package manager.
- **Planning**: Before non-trivial work, follow `skills/project-planning/SKILL.md` and keep an app-level `PLAN.md` when useful.
- **One app per pick**: Each demo lives under `apps/<slug>/` only. Never create a separate repository for a demo.
- **PR validation**: Every PR that ships or changes a runnable demo must include **at least one screenshot** and **at least one video** of the running app (UI and/or documented CLI + UI flow).
- **Licenses**: Prefer MIT/Apache-2.0 dependencies for enterprise-friendly stacks.
- **Secrets**: Do not commit API keys. Document fixture/demo modes that work without secrets and optional live paths when env vars are set.
