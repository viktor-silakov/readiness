# readiness

Agent Readiness skill for [Claude Code](https://claude.ai/code) - evaluate repository readiness for autonomous AI agents.

Inspired by [Factory AI Agent Readiness](https://factory.ai/news/agent-readiness).

## Installation

### As Claude Code Plugin (recommended)

```bash
claude plugin install readiness@https://github.com/viktor-silakov/readiness
```

### Manual Installation

Clone to your personal skills directory:

```bash
git clone https://github.com/viktor-silakov/readiness ~/.claude/skills/readiness
```

Or to project-level:

```bash
git clone https://github.com/viktor-silakov/readiness .claude/skills/readiness
```

### Via npx

```bash
npx claude-skill-readiness
```

This installs the skill to `.claude/skills/readiness/` in your project.

## Usage

In Claude Code, run:

```
/readiness
```

Or with plugin:

```
/readiness:readiness
```

## What it does

The skill evaluates your repository across **8 pillars** and assigns a **maturity level 1-5**:

### 8 Pillars

| Pillar | What's checked |
|--------|----------------|
| Style & Validation | ESLint, Prettier, Biome, formatters |
| Build System | package.json scripts, tsconfig, build tools |
| Testing | Jest, Vitest, Playwright, test coverage |
| Documentation | README, CLAUDE.md/AGENTS.md |
| Dev Environment | .nvmrc, .env.example, docker-compose |
| Code Quality | TypeScript strict mode, pre-commit hooks |
| Observability | Logging, error tracking |
| Security | .gitignore, secrets, dependencies audit |

### 5 Maturity Levels

| Level | Name | Description |
|-------|------|-------------|
| 1 | Functional | Build works, has entry point |
| 2 | Documented | README, installation instructions |
| 3 | Standardized | Tests, linting, TypeScript strict |
| 4 | Optimized | CI/CD, pre-commit hooks, coverage |
| 5 | Autonomous | AGENTS.md, E2E tests, CODEOWNERS |

## Output Example

```
+==============================================================+
|                    AGENT READINESS REPORT                     |
+==============================================================+
|  Repository: my-project                                       |
|  Level Achieved: 4 (Optimized)                                |
|  Overall Score: 78%                                           |
+--------------------------------------------------------------+

PILLAR SCORES
+-------------------------------------------------------------+
| Style & Validation    ████████████░░░░  75%  (3/4 criteria) |
| Build System          ████████████████  100% (4/4 criteria) |
| Testing               ██████████░░░░░░  62%  (5/8 criteria) |
| ...                                                          |
+-------------------------------------------------------------+
```

## Auto-fix

After generating the report, the skill offers to fix common issues:

- Create AGENTS.md with AI agent instructions
- Add .nvmrc with Node version
- Create CODEOWNERS file
- Add missing .gitignore entries
- Configure pre-commit hooks

## CLI Commands

```bash
npx claude-skill-readiness install   # Install skill (default)
npx claude-skill-readiness check     # Check if installed
npx claude-skill-readiness update    # Update skill files
npx claude-skill-readiness remove    # Remove skill
```

## Requirements

- Node.js >= 18
- Claude Code CLI

## License

MIT
