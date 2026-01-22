---
name: readiness
description: Assess how prepared a codebase is for AI agent collaboration. Analyzes 81 signals across 8 dimensions - code style, build tooling, tests, documentation, dev environment, quality gates, observability, and security. Outputs a maturity level (1-5) with actionable recommendations.
invocation: /readiness
version: 1.1.0
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

## Output Format

```markdown
# Readiness Level: [1-5]

# Applications Discovered
1. path/to/app - Description

# Results by Category

**Code Quality**
- lint_config: 1/1 - ESLint configured
- type_check: 0/1 - tsconfig.json missing strict mode

**Testing**
- unit_tests_exist: 1/1 - Found 42 test files
...

# Top 3 Actions to Level Up
1. Enable strict mode in tsconfig.json
2. Add AGENTS.md with setup instructions
3. Configure pre-commit hooks
```

---

## Evaluation Principles

- **Deterministic**: Same repo → same output
- **Existence-based**: Prefer file/config existence over semantic analysis
- **Conservative**: Ambiguous evidence = fail
- **Concise rationales**: Max 500 characters each
- **Strict schema**: Use only the 81 defined criterion IDs
