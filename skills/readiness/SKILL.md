---
name: readiness
description: Evaluate repository readiness for autonomous AI agents. Analyzes 8 pillars (style, build, testing, docs, environment, quality, observability, security), assigns maturity level 1-5, offers auto-fix. Use when assessing if a codebase is ready for AI agent collaboration or when improving developer experience.
invocation: /readiness
version: 1.0.0
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
  - Write
  - AskUserQuestion
---

# Agent Readiness Report

Evaluate repository readiness for autonomous AI agents using the **Autonomy Maturity Model**.

## Quick Start

```
/readiness
```

## What This Skill Does

1. **Scans** the repository across 8 pillars
2. **Evaluates** each criterion as pass/fail
3. **Assigns** maturity level 1-5
4. **Generates** a report with recommendations
5. **Offers** automatic fixes via interactive prompt

## 8 Pillars

| Pillar | What It Checks |
|--------|----------------|
| Style & Validation | ESLint, Prettier, Biome, formatters |
| Build System | package.json scripts, tsconfig, build tools |
| Testing | Jest, Vitest, Playwright, test coverage |
| Documentation | README, CLAUDE.md/AGENTS.md |
| Dev Environment | .nvmrc, .env.example, docker-compose |
| Code Quality | TypeScript strict mode, pre-commit hooks |
| Observability | Logging, error tracking |
| Security | .gitignore, secrets, dependency audit |

## 5 Maturity Levels

| Level | Name | Threshold | Description |
|-------|------|-----------|-------------|
| 1 | Functional | 80% L1 | Build works, entry point exists |
| 2 | Documented | 80% L2 + L1 | README, installation instructions |
| 3 | Standardized | 80% L3 + L2 | Tests, linting, TypeScript strict |
| 4 | Optimized | 80% L4 + L3 | CI/CD, pre-commit hooks, coverage |
| 5 | Autonomous | 80% L5 + L4 | AGENTS.md, E2E tests, CODEOWNERS |

## Execution Algorithm

### Step 1: Detect Project Type

```bash
Glob: package.json, */package.json
Glob: pnpm-workspace.yaml, lerna.json, packages/*/package.json
```

### Step 2: Scan Criteria

For each criterion, run checks per [CRITERIA.md](./CRITERIA.md).

**Example checks:**

```bash
Glob: .eslintrc*, eslint.config.*, .prettierrc*, biome.json
Glob: **/*.test.ts, **/*.spec.ts, e2e/**/*.spec.ts
Bash: pnpm test --run 2>&1 | head -20
Read: README.md
Read: tsconfig.json → check "strict": true
Glob: .husky/*, .lefthook.yml
```

### Step 3: Calculate Scores

```
pillar_score = passing_criteria / total_criteria
level = max level where score >= 80% AND all previous levels >= 80%
overall_score = sum(all_passing) / sum(all_criteria)
```

### Step 4: Generate Report

```
+==============================================================+
|                    AGENT READINESS REPORT                     |
+==============================================================+
|  Repository: {repo_name}                                      |
|  Level Achieved: {level} ({level_name})                       |
|  Overall Score: {overall_score}%                              |
+--------------------------------------------------------------+

PILLAR SCORES
+-------------------------------------------------------------+
| Style & Validation    {bar}  {score}%  ({n}/{m} criteria)   |
| Build System          {bar}  {score}%  ({n}/{m} criteria)   |
| Testing               {bar}  {score}%  ({n}/{m} criteria)   |
| Documentation         {bar}  {score}%  ({n}/{m} criteria)   |
| Dev Environment       {bar}  {score}%  ({n}/{m} criteria)   |
| Code Quality          {bar}  {score}%  ({n}/{m} criteria)   |
| Observability         {bar}  {score}%  ({n}/{m} criteria)   |
| Security              {bar}  {score}%  ({n}/{m} criteria)   |
+-------------------------------------------------------------+

PASSING CRITERIA
+-------------------------------------------------------------+
| * {criterion_name}                                           |
+-------------------------------------------------------------+

FAILING CRITERIA
+-------------------------------------------------------------+
| * {criterion_name} - {reason}                               |
+-------------------------------------------------------------+

ACTION ITEMS (to reach Level {next_level})
+-------------------------------------------------------------+
| 1. {action_item}                                            |
+-------------------------------------------------------------+
```

### Step 5: Auto-fix Prompt

After the report, if fixes are available, use **AskUserQuestion** with multiSelect:

```
Available automatic fixes:

[ ] Create AGENTS.md with AI agent instructions
[ ] Add .nvmrc with current Node version
[ ] Create CODEOWNERS file
[ ] Add missing entries to .gitignore
[ ] Set up pre-commit hooks (husky)
```

**After user selection:**
1. Apply selected fixes via Write tool
2. Show diff of each change
3. Re-run checks for modified criteria

## Auto-fix Templates

### AGENTS.md

```markdown
# AGENTS.md

Instructions for AI coding agents working with this repository.

## Quick Start

\`\`\`bash
{package_manager} install
{package_manager} dev
\`\`\`

## Project Structure

{auto_detected_structure}

## Commands

- `{package_manager} build` - Build the project
- `{package_manager} test` - Run tests
- `{package_manager} lint` - Run linter

## Code Style

{linter_info}

## Testing

{testing_info}
```

### .nvmrc

```
{current_node_version}
```

### CODEOWNERS

```
* @{github_username}

/packages/core/ @{github_username}
/packages/server/ @{github_username}
```

## Constraints

- **Languages:** JavaScript/TypeScript projects only
- **Package managers:** pnpm, npm, yarn
- **Output:** Console only (no file saving)

## See Also

- [CRITERIA.md](./CRITERIA.md) — Detailed evaluation criteria
