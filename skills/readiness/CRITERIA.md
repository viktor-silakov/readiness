# Agent Readiness Criteria

Detailed evaluation criteria for each maturity level.

## How to Check

Each criterion is **binary pass/fail**. Most checks involve file existence or configuration parsing.

---

## Level 1: Functional

Basic tooling — project can be built and run.

### L1.1 package.json exists

| Check | Command |
|-------|---------|
| Glob | `package.json` |
| Pass | File exists and contains valid JSON |

```bash
Glob: package.json
Read: package.json → JSON.parse() success
```

### L1.2 Build script defined

| Check | Command |
|-------|---------|
| Read | `package.json` → `scripts.build` exists |
| Pass | Build script is defined |

```bash
Read: package.json
Check: scripts.build !== undefined
```

### L1.3 Entry point defined

| Check | Command |
|-------|---------|
| Read | `package.json` → `main` OR `module` OR `exports` |
| Pass | At least one field is defined |

```bash
Read: package.json
Check: main || module || exports
```

### L1.4 Node version specified

| Check | Command |
|-------|---------|
| Glob | `.nvmrc` OR `.node-version` OR `package.json → engines.node` |
| Pass | Node version is specified by any method |

```bash
Glob: .nvmrc, .node-version
OR
Read: package.json → engines.node
```

---

## Level 2: Documented

Documentation enables a new developer to get started.

### L2.1 README exists

| Check | Command |
|-------|---------|
| Glob | `README.md` OR `README` |
| Pass | File exists and is not empty (>100 characters) |

```bash
Glob: README.md, README
Read: README.md → length > 100
```

### L2.2 Project description

| Check | Command |
|-------|---------|
| Read | `package.json → description` |
| Pass | Description field is not empty |

```bash
Read: package.json
Check: description && description.length > 10
```

### L2.3 Installation instructions

| Check | Command |
|-------|---------|
| Grep | `README.md` → `install` OR `npm` OR `pnpm` OR `yarn` |
| Pass | README contains installation instructions |

```bash
Grep: README.md
Pattern: (npm|pnpm|yarn)\s+(install|i)\b
```

### L2.4 Dev commands documented

| Check | Command |
|-------|---------|
| Grep | `README.md` → commands section |
| Pass | README contains a commands section |

```bash
Grep: README.md
Pattern: (##.*command|##.*script|##.*usage|\`\`\`bash)
```

---

## Level 3: Standardized

Code quality is automatically controlled.

### L3.1 Tests exist

| Check | Command |
|-------|---------|
| Glob | `**/*.test.ts`, `**/*.spec.ts`, `**/*.test.js`, `**/*.spec.js` |
| Pass | At least 1 test file found |

```bash
Glob: **/*.test.ts, **/*.spec.ts, **/*.test.js, **/*.spec.js
Check: results.length > 0
```

### L3.2 Tests pass

| Check | Command |
|-------|---------|
| Bash | `{package_manager} test --run` |
| Pass | Exit code 0 |

```bash
Bash: pnpm test --run 2>&1 | tail -10
Check: exit code === 0
```

### L3.3 Linter configured

| Check | Command |
|-------|---------|
| Glob | `.eslintrc*`, `eslint.config.*`, `biome.json`, `.biome.json` |
| Pass | Linter config found |

```bash
Glob: .eslintrc*, .eslintrc.js, .eslintrc.json, eslint.config.js, eslint.config.mjs, biome.json
Check: results.length > 0
```

### L3.4 TypeScript strict mode

| Check | Command |
|-------|---------|
| Read | `tsconfig.json → compilerOptions.strict` |
| Pass | strict === true |

```bash
Read: tsconfig.json
Check: compilerOptions.strict === true
```

### L3.5 .gitignore configured

| Check | Command |
|-------|---------|
| Glob | `.gitignore` |
| Grep | `.gitignore` → `node_modules` |
| Pass | .gitignore exists and contains node_modules |

```bash
Glob: .gitignore
Grep: .gitignore → node_modules
```

### L3.6 No hardcoded secrets

| Check | Command |
|-------|---------|
| Grep | `**/*.ts`, `**/*.js` → secret patterns |
| Pass | No secret patterns found |

```bash
Grep: **/*.ts, **/*.js (exclude node_modules, dist)
Patterns:
  - password\s*[:=]\s*["'][^"']{8,}["']
  - api[_-]?key\s*[:=]\s*["'][^"']{16,}["']
  - secret\s*[:=]\s*["'][^"']{8,}["']
Check: results.length === 0
```

---

## Level 4: Optimized

Processes are optimized for fast feedback.

### L4.1 Pre-commit hooks

| Check | Command |
|-------|---------|
| Glob | `.husky/*`, `.lefthook.yml`, `.pre-commit-config.yaml` |
| Pass | Pre-commit hooks configuration found |

```bash
Glob: .husky/pre-commit, .lefthook.yml, .pre-commit-config.yaml
Check: results.length > 0
```

### L4.2 CI/CD configured

| Check | Command |
|-------|---------|
| Glob | `.github/workflows/*.yml`, `.gitlab-ci.yml`, `Jenkinsfile`, `.circleci/config.yml` |
| Pass | CI/CD configuration found |

```bash
Glob: .github/workflows/*.yml, .gitlab-ci.yml, Jenkinsfile, .circleci/config.yml
Check: results.length > 0
```

### L4.3 Test coverage configured

| Check | Command |
|-------|---------|
| Read | `package.json` OR `vitest.config.*` OR `jest.config.*` |
| Pass | Coverage is configured |

```bash
Read: package.json → scripts (contains --coverage)
OR
Glob: vitest.config.*, jest.config.*
Read: → coverage settings
```

### L4.4 Dependency updates automated

| Check | Command |
|-------|---------|
| Glob | `renovate.json`, `.github/dependabot.yml`, `renovate.json5` |
| Pass | Auto-update configuration found |

```bash
Glob: renovate.json, renovate.json5, .github/dependabot.yml
Check: results.length > 0
```

### L4.5 Lint script works

| Check | Command |
|-------|---------|
| Bash | `{package_manager} lint` |
| Pass | Exit code 0 |

```bash
Bash: pnpm lint 2>&1 | tail -10
Check: exit code === 0
```

---

## Level 5: Autonomous

Repository is optimized for AI agent work.

### L5.1 Agent instructions file

| Check | Command |
|-------|---------|
| Glob | `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md` |
| Pass | Agent instructions file found |

```bash
Glob: AGENTS.md, CLAUDE.md, .cursorrules, .github/copilot-instructions.md
Check: results.length > 0
```

### L5.2 E2E tests exist

| Check | Command |
|-------|---------|
| Glob | `e2e/**/*.spec.ts`, `e2e/**/*.test.ts`, `tests/e2e/**/*`, `cypress/**/*` |
| Pass | E2E tests found |

```bash
Glob: e2e/**/*.spec.ts, e2e/**/*.test.ts, tests/e2e/**/*.ts, cypress/**/*.ts
Check: results.length > 0
```

### L5.3 Lint auto-fix available

| Check | Command |
|-------|---------|
| Read | `package.json → scripts` |
| Pass | lint:fix script exists or lint includes --fix |

```bash
Read: package.json
Check: scripts['lint:fix'] || scripts.lint.includes('--fix')
```

### L5.4 CODEOWNERS file

| Check | Command |
|-------|---------|
| Glob | `CODEOWNERS`, `.github/CODEOWNERS`, `docs/CODEOWNERS` |
| Pass | CODEOWNERS file found |

```bash
Glob: CODEOWNERS, .github/CODEOWNERS, docs/CODEOWNERS
Check: results.length > 0
```

### L5.5 Typecheck script

| Check | Command |
|-------|---------|
| Read | `package.json → scripts.typecheck` OR `scripts.type-check` |
| Pass | Typecheck script exists |

```bash
Read: package.json
Check: scripts.typecheck || scripts['type-check'] || scripts.tsc
```

---

## Pillar Mapping

Criteria are grouped by pillars:

| Pillar | Criteria |
|--------|----------|
| **Style & Validation** | L3.3, L3.4, L4.5, L5.3 |
| **Build System** | L1.1, L1.2, L1.3 |
| **Testing** | L3.1, L3.2, L4.3, L5.2 |
| **Documentation** | L2.1, L2.2, L2.3, L2.4, L5.1 |
| **Dev Environment** | L1.4, L4.1 |
| **Code Quality** | L3.4, L4.1, L5.5 |
| **Observability** | L4.3 |
| **Security** | L3.5, L3.6, L5.4 |

---

## Auto-fix Mapping

Which criteria can be auto-fixed:

| Criterion | Auto-fix | Action |
|-----------|----------|--------|
| L1.4 Node version | Yes | Create .nvmrc |
| L2.1 README | Partial | Create README.md template |
| L3.5 .gitignore | Yes | Add standard entries |
| L5.1 Agent instructions | Yes | Create AGENTS.md |
| L5.4 CODEOWNERS | Yes | Create CODEOWNERS |

---

## Scoring Formula

```
level_score[L] = passing_criteria[L] / total_criteria[L]

achieved_level = max L where:
  - level_score[L] >= 0.8
  - AND for all l < L: level_score[l] >= 0.8

overall_score = sum(all_passing) / sum(all_criteria) * 100
```
