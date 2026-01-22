---
name: readiness
description: Assess how prepared a codebase is for AI agent collaboration. Analyzes 81 signals across 8 dimensions - code style, build tooling, tests, documentation, dev environment, quality gates, observability, and security. Outputs a maturity level (1-5) with actionable recommendations.
invocation: /readiness
version: 1.2.0
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
  - Write
  - AskUserQuestion
---

# Repository Readiness Assessment

Perform a comprehensive audit of any repository to determine its readiness for autonomous AI agent workflows. This assessment is read-only and produces a structured report scoring 81 distinct criteria.

**Target:** Use `$ARGUMENTS` if a GitHub URL is provided, otherwise analyze the current working directory.

---

## Step 0: Clone If Needed

When `$ARGUMENTS` is a GitHub URL:

```bash
cd /tmp && git clone $ARGUMENTS && cd <repo-name>
```

Otherwise, work from the current directory.

---

## Step 1: Discover Repository Context

**Boundary Rules:**
- Stay within git repository root (where `.git` exists)
- Traversing up to repo root from subdirectories is allowed
- Never access paths outside the repository
- Skip `.git`, `node_modules`, `dist`, `build`, `__pycache__`

**Language Detection:**
- JS/TS: `package.json`, `tsconfig.json`, `.ts`/`.tsx`/`.js`/`.jsx` files
- Python: `pyproject.toml`, `setup.py`, `requirements.txt`, `.py` files
- Rust: `Cargo.toml`, `.rs` files
- Go: `go.mod`, `.go` files
- Java: `pom.xml`, `build.gradle`, `.java` files
- Ruby: `Gemfile`, `.gemspec`, `.rb` files

**Structure Mapping:**
- Locate source directories (`src/`, `app/`, `lib/`, `packages/`)
- Find config files, docs, and test directories

---

## Step 2: Identify Deployable Units

**Must complete before Step 3.**

An **application** is a directory representing a standalone deployable:
- Independent build/deploy lifecycle
- Serves users or systems directly
- Could function as its own repository

**Patterns:**
- Simple repos → 1 app (root)
- Monorepos → count each deployable service
- Libraries → 1 app (the library itself)
- Demo collections → 1 app (the collection)

**Rules:**
- Apps are directories, not files
- Shared packages/utilities are NOT apps
- Default to repo root if no apps found

**Output format:**
```
APPS_FOUND: N

1. [relative/path] - [description from README or package.json]
...
```

**Denominators:**
- Application-scoped criteria: denominator = N
- Repository-scoped criteria: denominator = 1

---

## Step 3: Evaluate All 81 Criteria

### Scoring Rules

**Repository Scope (43 criteria):**
- Evaluated once for entire repo
- numerator: 1 (pass), 0 (fail), null (skipped)
- denominator: always 1

**Application Scope (38 criteria):**
- Evaluated per-app
- numerator: count of passing apps (or null if skipped)
- denominator: always N (total apps)

---

### Repository-Scoped Checks

| ID | Level | Description |
|----|-------|-------------|
| **readme** | L1 | README.md present with basic setup instructions |
| **env_template** | L1 | `.env.example` or env vars documented in README/AGENTS.md |
| **gitignore_comprehensive** | L1 | `.gitignore` covers `.env`, `node_modules`, build outputs, IDE files, OS files |
| **build_cmd_doc** | L2 | Build commands documented in README or AGENTS.md |
| **deps_pinned** | L2 | Lockfile committed (package-lock, yarn.lock, pnpm-lock, poetry.lock, or pinned requirements.txt) |
| **vcs_cli_tools** | L2 | `gh` or `glab` CLI installed and authenticated |
| **automated_pr_review** | L2 | [Skip] Bot-generated PR review comments (danger.js, AI reviewers) |
| **monorepo_tooling** | L2 | [Skip] Turborepo/Nx/Lerna configured for monorepos |
| **agents_md** | L2 | AGENTS.md at root with agent-focused instructions (>100 chars) |
| **automated_doc_generation** | L2 | Auto-generated docs (Swagger, JSDoc, Sphinx, changelog generators) |
| **devcontainer** | L2 | `.devcontainer/devcontainer.json` configured |
| **local_services_setup** | L2 | [Skip] docker-compose for local deps (DB, Redis, etc.) |
| **runbooks_documented** | L2 | Links to runbooks/playbooks in docs |
| **branch_protection** | L2 | [Skip] Branch protection via `gh api` (rulesets or legacy) |
| **codeowners** | L2 | CODEOWNERS file with valid assignments |
| **automated_security_review** | L2 | [Skip] SAST reports in PRs (Semgrep, CodeQL, Snyk) |
| **dependency_update_automation** | L2 | Dependabot or Renovate configured |
| **secrets_management** | L2 | Secrets manager integration or proper `.env` handling |
| **issue_templates** | L2 | `.github/ISSUE_TEMPLATE/` or `.gitlab/issue_templates/` |
| **issue_labeling_system** | L2 | Consistent labels (priority, type, area) |
| **pr_templates** | L2 | PR template with description/testing sections |
| **large_file_detection** | L3 | Git hooks, LFS, or linter rules for file size limits |
| **tech_debt_tracking** | L3 | TODO/FIXME scanning, SonarQube debt tracking |
| **agentic_development** | L3 | Evidence of AI agents in git history or CI |
| **single_command_setup** | L3 | One command from clone to running dev server |
| **release_notes_automation** | L3 | Auto-generated changelogs (semantic-release, changesets) |
| **version_drift_detection** | L3 | [Skip] Monorepo version sync tools (syncpack, manypkg) |
| **release_automation** | L3 | CD pipelines, GitOps, or auto Docker publishing |
| **dead_feature_flag_detection** | L3 | [Skip] Stale flag detection (requires feature_flag_infrastructure) |
| **skills** | L3 | Skills directory with valid SKILL.md files |
| **documentation_freshness** | L3 | Key docs updated within 180 days |
| **service_flow_documented** | L3 | Architecture diagrams or service dependency docs |
| **devcontainer_runnable** | L3 | [Skip] Devcontainer builds successfully |
| **secret_scanning** | L3 | [Skip] Gitleaks, trufflehog, or GitHub secret scanning |
| **fast_ci_feedback** | L4 | [Skip] CI completes in under 10 minutes |
| **build_performance_tracking** | L4 | [Skip] Build caching and timing metrics |
| **deployment_frequency** | L4 | [Skip] Multiple deploys per week |
| **feature_flag_infrastructure** | L4 | LaunchDarkly, Statsig, Unleash, or similar |
| **progressive_rollout** | L4 | [Skip] Canary or percentage-based deploys |
| **rollback_automation** | L4 | [Skip] One-click rollback capability |
| **agents_md_validation** | L4 | CI validates AGENTS.md commands work |
| **privacy_compliance** | L4 | [Skip] GDPR/CCPA handling, consent management |
| **backlog_health** | L4 | [Skip] >70% issues have titles >10 chars + labels |

---

### Application-Scoped Checks

| ID | Level | Description |
|----|-------|-------------|
| **lint_config** | L1 | Linter configured (ESLint, ruff, flake8, SonarQube) |
| **type_check** | L1 | Type checker (tsconfig strict, mypy) |
| **formatter** | L1 | Code formatter (Prettier, Black) |
| **unit_tests_exist** | L1 | Test files present (*.test.ts, test_*.py) |
| **pre_commit_hooks** | L2 | Husky/lint-staged or .pre-commit-config.yaml |
| **strict_typing** | L2 | [Skip] Strict mode enabled in type checker |
| **unit_tests_runnable** | L2 | Test command works (use --listTests or --collect-only) |
| **test_coverage_thresholds** | L2 | Minimum coverage enforced |
| **database_schema** | L2 | [Skip] Schema files (Prisma, TypeORM, SQLAlchemy) |
| **structured_logging** | L2 | Logging library configured (pino, winston, structlog) |
| **error_tracking_contextualized** | L2 | Sentry/Bugsnag with source maps and context |
| **naming_consistency** | L3 | Naming conventions enforced via linter or docs |
| **dead_code_detection** | L3 | Unused code detection (knip, vulture, ESLint no-unused-vars) |
| **duplicate_code_detection** | L3 | Copy-paste detection (jscpd, SonarQube CPD) |
| **unused_dependencies_detection** | L3 | Unused deps check (depcheck, knip, deptry) |
| **integration_tests_exist** | L3 | E2E or integration tests (Playwright, Cypress, pytest integration) |
| **test_naming_conventions** | L3 | Test file naming patterns enforced |
| **api_schema_docs** | L3 | [Skip] OpenAPI/Swagger or GraphQL schema |
| **distributed_tracing** | L3 | Trace ID propagation (OpenTelemetry, X-Request-ID) |
| **metrics_collection** | L3 | Metrics instrumentation (Datadog, Prometheus, CloudWatch) |
| **alerting_configured** | L3 | PagerDuty, OpsGenie, or custom alerts |
| **health_checks** | L3 | [Skip] /health endpoints or K8s probes |
| **pii_handling** | L3 | [Skip] PII detection/masking tooling |
| **log_scrubbing** | L3 | Log redaction configured |
| **product_analytics_instrumentation** | L3 | Mixpanel, Amplitude, PostHog, or GA4 |
| **code_modularization** | L4 | [Skip] Module boundary enforcement (eslint-plugin-boundaries, ArchUnit) |
| **n_plus_one_detection** | L4 | [Skip] N+1 query detection (bullet, nplusone, DataLoader) |
| **heavy_dependency_detection** | L4 | [Skip] Bundle size analysis |
| **test_performance_tracking** | L4 | Test timing tracked in CI |
| **flaky_test_detection** | L4 | [Skip] Test retry config or flaky tracking |
| **test_isolation** | L4 | Parallel test execution configured |
| **code_quality_metrics** | L4 | [Skip] Coverage/complexity tracking |
| **deployment_observability** | L4 | Dashboard links or deploy notifications |
| **circuit_breakers** | L4 | [Skip] Resilience patterns (opossum, resilience4j) |
| **profiling_instrumentation** | L4 | [Skip] APM or profiling tools |
| **dast_scanning** | L4 | [Skip] OWASP ZAP or DAST in CI |
| **cyclomatic_complexity** | L5 | Complexity analysis (ESLint complexity, radon, SonarQube) |
| **error_to_insight_pipeline** | L5 | Error tracking → issue creation automation |

---

## Step 4: Validate Report

Before generating output, verify:

1. **Denominator consistency:**
   - 43 repo-scoped criteria → denominator = 1
   - 38 app-scoped criteria → denominator = N

2. **All 81 criteria present:**
   `large_file_detection, tech_debt_tracking, build_cmd_doc, deps_pinned, vcs_cli_tools, automated_pr_review, agentic_development, fast_ci_feedback, build_performance_tracking, deployment_frequency, single_command_setup, feature_flag_infrastructure, release_notes_automation, progressive_rollout, rollback_automation, monorepo_tooling, version_drift_detection, release_automation, dead_feature_flag_detection, agents_md, readme, automated_doc_generation, skills, documentation_freshness, service_flow_documented, agents_md_validation, devcontainer, env_template, local_services_setup, devcontainer_runnable, runbooks_documented, branch_protection, secret_scanning, codeowners, automated_security_review, dependency_update_automation, gitignore_comprehensive, privacy_compliance, secrets_management, issue_templates, issue_labeling_system, backlog_health, pr_templates, lint_config, type_check, formatter, pre_commit_hooks, strict_typing, naming_consistency, cyclomatic_complexity, dead_code_detection, duplicate_code_detection, code_modularization, n_plus_one_detection, heavy_dependency_detection, unused_dependencies_detection, unit_tests_exist, integration_tests_exist, unit_tests_runnable, test_performance_tracking, flaky_test_detection, test_coverage_thresholds, test_naming_conventions, test_isolation, api_schema_docs, database_schema, structured_logging, distributed_tracing, metrics_collection, code_quality_metrics, error_tracking_contextualized, alerting_configured, deployment_observability, health_checks, circuit_breakers, profiling_instrumentation, dast_scanning, pii_handling, log_scrubbing, product_analytics_instrumentation, error_to_insight_pipeline`

---

## Step 5: Calculate Maturity Level

**Scoring:**
- Skipped criteria (null numerator) excluded from calculation
- Level score = sum(numerators) / sum(denominators) for that level

**Progression:**
- **Level 1**: Baseline (all repos start here)
- **Level 2**: ≥80% of L1 criteria pass
- **Level 3**: L2 achieved + ≥80% of L2 criteria pass
- **Level 4**: L3 achieved + ≥80% of L3 criteria pass
- **Level 5**: L4 achieved + ≥80% of L4 criteria pass

---

## Step 6: Generate Visual Report

**IMPORTANT:** Output MUST use ASCII box-drawing and ANSI colors for terminal display.

### Color Scheme (ANSI Escape Codes)

Use these colors based on percentage scores:
- **Green** `\033[32m` — 80-100% (excellent)
- **Yellow** `\033[33m` — 50-79% (needs improvement)  
- **Red** `\033[31m` — 0-49% (critical)
- **Gray** `\033[90m` — Skipped criteria
- **Cyan** `\033[36m` — Headers and borders
- **Bold** `\033[1m` — Emphasis
- **Reset** `\033[0m` — Reset formatting

### Progress Bar Format

Use block characters for visual progress:
```
100%: ████████████████████████████████
 75%: ████████████████████████░░░░░░░░
 50%: ████████████████░░░░░░░░░░░░░░░░
 25%: ████████░░░░░░░░░░░░░░░░░░░░░░░░
  0%: ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```

Bar width: 24 characters (each █ or ░ = ~4.17%)

### Output Structure

Print using `echo -e` for ANSI support:

```bash
echo -e "\033[36m╔══════════════════════════════════════════════════════════════════╗\033[0m"
```

#### 1. Header Banner

```
╔══════════════════════════════════════════════════════════════════╗
║              🤖 AGENT READINESS ASSESSMENT                       ║
╠══════════════════════════════════════════════════════════════════╣
║  Repository:  <repo-name>                                        ║
║  Level:       ████░░░░░░  3/5  (Standardized)                   ║
║  Score:       68% (45/66 criteria passed)                        ║
║  Apps Found:  1                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

#### 2. Pillar Overview (8 pillars)

Group criteria into 8 pillars with visual bars:

```
┌─────────────────────────────────────────────────────────────────┐
│                      📊 PILLAR OVERVIEW                         │
├─────────────────────────────────────────────────────────────────┤
│ Code Quality       ████████████████████░░░░  80%  ✓   6/7      │
│ Build Tooling      ██████████████░░░░░░░░░░  58%  ⚠   5/8      │
│ Testing            ████████████████████████ 100%  ✓   8/8      │
│ Documentation      ██████████████████░░░░░░  75%  ✓   6/8      │
│ Dev Environment    ████████░░░░░░░░░░░░░░░░  33%  ✗   2/6      │
│ Quality Gates      ██████████████░░░░░░░░░░  57%  ⚠   4/7      │
│ Security           ████████████████░░░░░░░░  67%  ⚠   6/9      │
│ Observability      ██████████████████░░░░░░  71%  ⚠   5/7      │
└─────────────────────────────────────────────────────────────────┘
```

Status icons:
- `✓` (green) — 80%+
- `⚠` (yellow) — 50-79%
- `✗` (red) — <50%

#### 3. Level Progression

```
┌─────────────────────────────────────────────────────────────────┐
│                    📈 LEVEL PROGRESSION                         │
├───────┬─────────────────┬───────┬──────────────────────────────┤
│  L1   │ Functional      │ 100%  │ ████████████████████████  ✓  │
│  L2   │ Documented      │  87%  │ █████████████████████░░░  ✓  │
│  L3   │ Standardized    │  50%  │ ████████████░░░░░░░░░░░░  ✗  │
│  L4   │ Optimized       │   —   │ ░░░░░░░░░░░░░░░░░░░░░░░░     │
│  L5   │ Autonomous      │   —   │ ░░░░░░░░░░░░░░░░░░░░░░░░     │
└───────┴─────────────────┴───────┴──────────────────────────────┘
```

#### 4. Detailed Results by Pillar

For each pillar, show expandable details:

```
┌─ CODE QUALITY ──────────────────────────────────────────────────┐
│  ✓  lint_config          ESLint + Clippy configured             │
│  ✓  type_check           TypeScript strict: true                │
│  ✓  formatter            Prettier + rustfmt                     │
│  ✓  pre_commit_hooks     Lefthook configured                    │
│  ✓  naming_consistency   ESLint unicorn/filename-case           │
│  ✓  dead_code_detection  no-unused-vars enabled                 │
│  ✗  cyclomatic_complex   No complexity rules configured         │
│  ○  strict_typing        [Skipped]                              │
└─────────────────────────────────────────────────────────────────┘
```

Legend:
- `✓` — Pass (green)
- `✗` — Fail (red)
- `○` — Skipped (gray)

#### 5. Top Actions to Level Up

```
┌─ 🎯 TOP 5 ACTIONS TO LEVEL UP ──────────────────────────────────┐
│                                                                 │
│  1. [HIGH] Add test coverage thresholds                         │
│     Impact: L2 requirement                                      │
│     Action: Configure vitest coverage.thresholds in config      │
│                                                                 │
│  2. [HIGH] Create issue/PR templates                            │
│     Impact: L2 requirement                                      │
│     Action: Add .github/ISSUE_TEMPLATE/ and PR_TEMPLATE.md      │
│                                                                 │
│  3. [MED]  Configure Dependabot                                 │
│     Impact: L2 security criterion                               │
│     Action: Create .github/dependabot.yml                       │
│                                                                 │
│  4. [MED]  Add devcontainer                                     │
│     Impact: L2 dev environment                                  │
│     Action: Create .devcontainer/devcontainer.json              │
│                                                                 │
│  5. [LOW]  Enable distributed tracing                           │
│     Impact: L3 observability                                    │
│     Action: Add OpenTelemetry instrumentation                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Priority levels:
- `[HIGH]` — Blocking next level (red)
- `[MED]` — Important for progression (yellow)
- `[LOW]` — Nice to have (white)

#### 6. Quick Summary Footer

```
═══════════════════════════════════════════════════════════════════
  Level 3 achieved. Need 80% on L3 criteria (currently 50%) for L4.
  Run /readiness --fix to auto-fix common issues.
═══════════════════════════════════════════════════════════════════
```

### Pillar Groupings

Map criteria to pillars:

| Pillar | Criteria IDs |
|--------|-------------|
| **Code Quality** | lint_config, type_check, formatter, pre_commit_hooks, strict_typing, naming_consistency, cyclomatic_complexity, dead_code_detection, duplicate_code_detection, code_modularization |
| **Build Tooling** | build_cmd_doc, deps_pinned, single_command_setup, release_notes_automation, release_automation, monorepo_tooling, version_drift_detection, dead_feature_flag_detection, n_plus_one_detection, heavy_dependency_detection, unused_dependencies_detection |
| **Testing** | unit_tests_exist, unit_tests_runnable, test_coverage_thresholds, integration_tests_exist, test_naming_conventions, test_performance_tracking, flaky_test_detection, test_isolation |
| **Documentation** | readme, agents_md, automated_doc_generation, skills, documentation_freshness, service_flow_documented, agents_md_validation, runbooks_documented |
| **Dev Environment** | env_template, devcontainer, devcontainer_runnable, local_services_setup, vcs_cli_tools, agentic_development |
| **Quality Gates** | large_file_detection, tech_debt_tracking, fast_ci_feedback, build_performance_tracking, deployment_frequency, feature_flag_infrastructure, progressive_rollout, rollback_automation |
| **Security** | gitignore_comprehensive, branch_protection, secret_scanning, codeowners, automated_security_review, dependency_update_automation, secrets_management, privacy_compliance, pii_handling, log_scrubbing, dast_scanning |
| **Observability** | structured_logging, distributed_tracing, metrics_collection, code_quality_metrics, error_tracking_contextualized, alerting_configured, deployment_observability, health_checks, circuit_breakers, profiling_instrumentation, product_analytics_instrumentation, error_to_insight_pipeline |
| **Issue Management** | issue_templates, issue_labeling_system, pr_templates, backlog_health, automated_pr_review |
| **API & Data** | api_schema_docs, database_schema |

### Bash Color Helper

Use this pattern for colored output:

```bash
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${CYAN}╔════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC} ${GREEN}✓${NC} lint_config    ESLint configured ${CYAN}║${NC}"
echo -e "${CYAN}║${NC} ${RED}✗${NC} devcontainer   Not found          ${CYAN}║${NC}"
echo -e "${CYAN}╚════════════════════════════════════╝${NC}"
```

---

## Step 7: Offer HTML Report (Optional)

After displaying the ASCII report, ask the user:

```
Would you like to generate an interactive HTML report with D3.js charts?
This will create a visual dashboard you can open in a browser.
[yes/no]
```

If user agrees, generate `readiness-report.html` in the repository root.

### HTML Report Features

The HTML report includes:
1. **Radar Chart** — Category breakdown (like Factory AI dashboard)
2. **Progress Bars** — Pillar scores with color coding
3. **Level Indicator** — Current maturity level 1-5
4. **Criteria Table** — Expandable details per pillar
5. **Top Actions** — Prioritized recommendations

### HTML Template

Generate a self-contained HTML file with inline D3.js:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agent Readiness Report - {{REPO_NAME}}</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <style>
    :root {
      --bg-primary: #0d0d0d;
      --bg-secondary: #1a1a1a;
      --bg-card: #242424;
      --border: #333;
      --text-primary: #fff;
      --text-secondary: #888;
      --accent: #e65c00;
      --green: #22c55e;
      --yellow: #eab308;
      --red: #ef4444;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      padding: 24px;
      min-height: 100vh;
    }
    .dashboard { max-width: 1400px; margin: 0 auto; }
    .header {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    .card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 20px;
    }
    .card-title {
      font-size: 12px;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }
    .level-display {
      font-size: 48px;
      font-weight: 700;
    }
    .score-display {
      font-size: 48px;
      font-weight: 700;
    }
    .score-display span { font-size: 24px; color: var(--text-secondary); }
    .charts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    .pillars { margin-bottom: 24px; }
    .pillar-row {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
    }
    .pillar-name { width: 180px; font-weight: 500; }
    .pillar-bar {
      flex: 1;
      height: 24px;
      background: var(--bg-secondary);
      border-radius: 4px;
      overflow: hidden;
      margin: 0 16px;
    }
    .pillar-bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.5s ease;
    }
    .pillar-score { width: 60px; text-align: right; font-weight: 600; }
    .pillar-status { width: 30px; text-align: center; font-size: 18px; }
    .green { color: var(--green); }
    .yellow { color: var(--yellow); }
    .red { color: var(--red); }
    .bg-green { background: var(--green); }
    .bg-yellow { background: var(--yellow); }
    .bg-red { background: var(--red); }
    .actions-card { margin-bottom: 24px; }
    .action-item {
      padding: 16px;
      border-bottom: 1px solid var(--border);
    }
    .action-item:last-child { border-bottom: none; }
    .action-priority {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      margin-right: 8px;
    }
    .priority-high { background: var(--red); }
    .priority-med { background: var(--yellow); color: #000; }
    .priority-low { background: var(--border); }
    .action-title { font-weight: 600; margin-bottom: 4px; }
    .action-desc { color: var(--text-secondary); font-size: 14px; }
    .radar-chart { width: 100%; height: 300px; }
    .criteria-table { width: 100%; }
    .criteria-row {
      display: flex;
      padding: 8px 16px;
      border-bottom: 1px solid var(--border);
      font-size: 14px;
    }
    .criteria-status { width: 30px; }
    .criteria-id { width: 200px; font-family: monospace; }
    .criteria-desc { flex: 1; color: var(--text-secondary); }
  </style>
</head>
<body>
  <div class="dashboard">
    <div class="header">
      <div class="card">
        <div class="card-title">Readiness Level</div>
        <div class="level-display">LEVEL {{LEVEL}}</div>
      </div>
      <div class="card">
        <div class="card-title">Overall Score</div>
        <div class="score-display">{{SCORE}}<span>/{{TOTAL}}</span></div>
      </div>
      <div class="card">
        <div class="card-title">Repository</div>
        <div style="font-size: 24px; font-weight: 600;">{{REPO_NAME}}</div>
        <div style="color: var(--text-secondary); margin-top: 8px;">{{APPS_COUNT}} app(s) detected</div>
      </div>
    </div>

    <div class="charts">
      <div class="card">
        <div class="card-title">Category Breakdown</div>
        <div id="radar-chart" class="radar-chart"></div>
      </div>
      <div class="card">
        <div class="card-title">Level Progression</div>
        <div id="level-chart" style="height: 300px;"></div>
      </div>
    </div>

    <div class="card pillars">
      <div class="card-title">Pillar Overview</div>
      {{PILLAR_ROWS}}
    </div>

    <div class="card actions-card">
      <div class="card-title">Top Actions to Level Up</div>
      {{ACTION_ITEMS}}
    </div>

    <div class="card">
      <div class="card-title">Detailed Criteria</div>
      {{CRITERIA_ROWS}}
    </div>
  </div>

  <script>
    const pillarData = {{PILLAR_DATA_JSON}};
    const levelData = {{LEVEL_DATA_JSON}};

    // Radar Chart
    const radarWidth = 350, radarHeight = 300;
    const radarMargin = 50;
    const radarRadius = Math.min(radarWidth, radarHeight) / 2 - radarMargin;

    const radarSvg = d3.select("#radar-chart")
      .append("svg")
      .attr("width", radarWidth)
      .attr("height", radarHeight)
      .append("g")
      .attr("transform", `translate(${radarWidth/2}, ${radarHeight/2})`);

    const angleSlice = (Math.PI * 2) / pillarData.length;

    // Draw grid
    const levels = 5;
    for (let i = 1; i <= levels; i++) {
      const r = (radarRadius / levels) * i;
      radarSvg.append("circle")
        .attr("r", r)
        .attr("fill", "none")
        .attr("stroke", "#333")
        .attr("stroke-width", 1);
    }

    // Draw axes
    pillarData.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = Math.cos(angle) * radarRadius;
      const y = Math.sin(angle) * radarRadius;

      radarSvg.append("line")
        .attr("x1", 0).attr("y1", 0)
        .attr("x2", x).attr("y2", y)
        .attr("stroke", "#333");

      radarSvg.append("text")
        .attr("x", Math.cos(angle) * (radarRadius + 20))
        .attr("y", Math.sin(angle) * (radarRadius + 20))
        .attr("text-anchor", "middle")
        .attr("fill", "#888")
        .attr("font-size", "11px")
        .text(d.name);
    });

    // Draw data polygon
    const lineGenerator = d3.lineRadial()
      .radius(d => (d.score / 100) * radarRadius)
      .angle((d, i) => angleSlice * i)
      .curve(d3.curveLinearClosed);

    radarSvg.append("path")
      .datum(pillarData)
      .attr("d", lineGenerator)
      .attr("fill", "#e65c00")
      .attr("fill-opacity", 0.3)
      .attr("stroke", "#e65c00")
      .attr("stroke-width", 2);

    // Level progression chart
    const levelWidth = 500, levelHeight = 280;
    const levelMargin = { top: 20, right: 30, bottom: 40, left: 40 };

    const levelSvg = d3.select("#level-chart")
      .append("svg")
      .attr("width", levelWidth)
      .attr("height", levelHeight);

    const xScale = d3.scaleBand()
      .domain(levelData.map(d => d.level))
      .range([levelMargin.left, levelWidth - levelMargin.right])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([levelHeight - levelMargin.bottom, levelMargin.top]);

    // Bars
    levelSvg.selectAll("rect")
      .data(levelData)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.level))
      .attr("y", d => yScale(d.score))
      .attr("width", xScale.bandwidth())
      .attr("height", d => levelHeight - levelMargin.bottom - yScale(d.score))
      .attr("fill", d => d.achieved ? "#e65c00" : "#333")
      .attr("rx", 4);

    // 80% threshold line
    levelSvg.append("line")
      .attr("x1", levelMargin.left)
      .attr("x2", levelWidth - levelMargin.right)
      .attr("y1", yScale(80))
      .attr("y2", yScale(80))
      .attr("stroke", "#22c55e")
      .attr("stroke-dasharray", "4,4");

    levelSvg.append("text")
      .attr("x", levelWidth - levelMargin.right - 5)
      .attr("y", yScale(80) - 5)
      .attr("fill", "#22c55e")
      .attr("font-size", "11px")
      .attr("text-anchor", "end")
      .text("80% threshold");

    // X axis
    levelSvg.append("g")
      .attr("transform", `translate(0, ${levelHeight - levelMargin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("fill", "#888");

    levelSvg.selectAll(".domain, .tick line").attr("stroke", "#333");
  </script>
</body>
</html>
```

### Template Variables

Replace these placeholders when generating:

| Variable | Description |
|----------|-------------|
| `{{REPO_NAME}}` | Repository name |
| `{{LEVEL}}` | Maturity level (1-5) |
| `{{SCORE}}` | Passed criteria count |
| `{{TOTAL}}` | Total evaluated criteria |
| `{{APPS_COUNT}}` | Number of apps found |
| `{{PILLAR_ROWS}}` | HTML for pillar progress bars |
| `{{ACTION_ITEMS}}` | HTML for top actions |
| `{{CRITERIA_ROWS}}` | HTML for detailed criteria |
| `{{PILLAR_DATA_JSON}}` | JSON array for radar chart |
| `{{LEVEL_DATA_JSON}}` | JSON array for level chart |

### JSON Data Formats

**Pillar Data (for radar chart):**
```json
[
  {"name": "Code Quality", "score": 80},
  {"name": "Build", "score": 58},
  {"name": "Testing", "score": 100},
  {"name": "Docs", "score": 75},
  {"name": "Dev Env", "score": 33},
  {"name": "Quality Gates", "score": 57},
  {"name": "Security", "score": 67},
  {"name": "Observability", "score": 71}
]
```

**Level Data (for bar chart):**
```json
[
  {"level": "L1", "score": 100, "achieved": true},
  {"level": "L2", "score": 87, "achieved": true},
  {"level": "L3", "score": 50, "achieved": false},
  {"level": "L4", "score": 0, "achieved": false},
  {"level": "L5", "score": 0, "achieved": false}
]
```

### Generation Command

After user confirms, write the file:

```bash
cat > readiness-report.html << 'EOF'
[generated HTML content]
EOF

echo "✓ Report saved to readiness-report.html"
echo "  Open in browser: open readiness-report.html"
```

---

## Evaluation Principles

- **Deterministic**: Same repo → same output
- **Existence-based**: Prefer file/config existence over semantic analysis
- **Conservative**: Ambiguous evidence = fail
- **Concise rationales**: Max 500 characters each
- **Strict schema**: Use only the 81 defined criterion IDs
