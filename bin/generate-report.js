#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agent Readiness Report - {{REPO_NAME}}</title>
  <script src="https://d3js.org/d3.v7.min.js"><\/script>
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
    .level-display { font-size: 48px; font-weight: 700; }
    .score-display { font-size: 48px; font-weight: 700; }
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
    .pillar-row:last-child { border-bottom: none; }
    .pillar-name { width: 180px; font-weight: 500; }
    .pillar-bar {
      flex: 1;
      height: 24px;
      background: var(--bg-secondary);
      border-radius: 4px;
      overflow: hidden;
      margin: 0 16px;
    }
    .pillar-bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
    .pillar-score { width: 60px; text-align: right; font-weight: 600; }
    .pillar-count { width: 60px; text-align: right; color: var(--text-secondary); font-size: 14px; }
    .pillar-status { width: 30px; text-align: center; font-size: 18px; }
    .green { color: var(--green); }
    .yellow { color: var(--yellow); }
    .red { color: var(--red); }
    .bg-green { background: var(--green); }
    .bg-yellow { background: var(--yellow); }
    .bg-red { background: var(--red); }
    .bg-accent { background: var(--accent); }
    .actions-card { margin-bottom: 24px; }
    .action-item { padding: 16px; border-bottom: 1px solid var(--border); }
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
    .radar-chart { display: flex; justify-content: center; }
    .criteria-section { margin-top: 8px; }
    .criteria-header {
      padding: 12px 16px;
      background: var(--bg-secondary);
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 4px;
      margin-bottom: 4px;
    }
    .criteria-header:hover { background: #2a2a2a; }
    .criteria-content { display: none; padding: 8px 16px; }
    .criteria-content.open { display: block; }
    .criteria-row {
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid var(--border);
      font-size: 14px;
    }
    .criteria-row:last-child { border-bottom: none; }
    .criteria-status { width: 30px; }
    .criteria-id { width: 220px; font-family: monospace; }
    .criteria-desc { flex: 1; color: var(--text-secondary); }
    .expand-icon { transition: transform 0.2s; }
    .expand-icon.open { transform: rotate(180deg); }
    .generated-at {
      text-align: center;
      color: var(--text-secondary);
      font-size: 12px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
    }
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
      <div class="criteria-section">
        {{CRITERIA_SECTIONS}}
      </div>
    </div>

    <div class="generated-at">
      Generated on {{GENERATED_AT}} by claude-skill-readiness
    </div>
  </div>

  <script>
    const pillarData = {{PILLAR_DATA_JSON}};
    const levelData = {{LEVEL_DATA_JSON}};

    // Radar Chart
    const radarWidth = 380, radarHeight = 320;
    const radarMargin = 60;
    const radarRadius = Math.min(radarWidth, radarHeight) / 2 - radarMargin;

    const radarSvg = d3.select("#radar-chart")
      .append("svg")
      .attr("width", radarWidth)
      .attr("height", radarHeight)
      .append("g")
      .attr("transform", \`translate(\${radarWidth/2}, \${radarHeight/2})\`);

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

    // Draw axes and labels
    pillarData.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = Math.cos(angle) * radarRadius;
      const y = Math.sin(angle) * radarRadius;

      radarSvg.append("line")
        .attr("x1", 0).attr("y1", 0)
        .attr("x2", x).attr("y2", y)
        .attr("stroke", "#333");

      const labelX = Math.cos(angle) * (radarRadius + 25);
      const labelY = Math.sin(angle) * (radarRadius + 25);

      radarSvg.append("text")
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
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

    // Draw data points
    pillarData.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const r = (d.score / 100) * radarRadius;
      radarSvg.append("circle")
        .attr("cx", Math.cos(angle) * r)
        .attr("cy", Math.sin(angle) * r)
        .attr("r", 4)
        .attr("fill", "#e65c00");
    });

    // Level progression chart
    const levelWidth = 500, levelHeight = 280;
    const levelMargin = { top: 20, right: 30, bottom: 40, left: 50 };

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

    // Y axis
    levelSvg.append("g")
      .attr("transform", \`translate(\${levelMargin.left}, 0)\`)
      .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => d + "%"))
      .selectAll("text")
      .attr("fill", "#888");

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

    // Score labels on bars
    levelSvg.selectAll(".bar-label")
      .data(levelData)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", d => xScale(d.level) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.score) - 5)
      .attr("text-anchor", "middle")
      .attr("fill", d => d.score > 0 ? "#fff" : "#666")
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .text(d => d.score > 0 ? d.score + "%" : "—");

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
      .attr("transform", \`translate(0, \${levelHeight - levelMargin.bottom})\`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("fill", "#888");

    levelSvg.selectAll(".domain, .tick line").attr("stroke", "#333");

    // Collapsible sections
    document.querySelectorAll('.criteria-header').forEach(header => {
      header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const icon = header.querySelector('.expand-icon');
        content.classList.toggle('open');
        icon.classList.toggle('open');
      });
    });
  <\/script>
</body>
</html>`;

function getStatusClass(score) {
  if (score >= 80) return 'green';
  if (score >= 50) return 'yellow';
  return 'red';
}

function getStatusIcon(score) {
  if (score >= 80) return '✓';
  if (score >= 50) return '⚠';
  return '✗';
}

function getBgClass(score) {
  if (score >= 80) return 'bg-green';
  if (score >= 50) return 'bg-yellow';
  return 'bg-red';
}

function generatePillarRows(pillars) {
  return pillars.map(p => `
      <div class="pillar-row">
        <div class="pillar-name">${p.name}</div>
        <div class="pillar-bar">
          <div class="pillar-bar-fill ${getBgClass(p.score)}" style="width: ${p.score}%"></div>
        </div>
        <div class="pillar-score">${p.score}%</div>
        <div class="pillar-count">${p.passed}/${p.total}</div>
        <div class="pillar-status ${getStatusClass(p.score)}">${getStatusIcon(p.score)}</div>
      </div>`).join('\n');
}

function generateActionItems(actions) {
  return actions.map((a, i) => `
      <div class="action-item">
        <span class="action-priority priority-${a.priority.toLowerCase()}">${a.priority}</span>
        <span class="action-title">${i + 1}. ${a.title}</span>
        <div class="action-desc">${a.description}</div>
      </div>`).join('\n');
}

function generateCriteriaSections(pillars, criteria) {
  return pillars.map(p => {
    const pillarCriteria = criteria.filter(c => c.pillar === p.name);
    const rows = pillarCriteria.map(c => {
      const statusIcon = c.status === 'pass' ? '✓' : c.status === 'skip' ? '○' : '✗';
      const statusClass = c.status === 'pass' ? 'green' : c.status === 'skip' ? '' : 'red';
      return `
          <div class="criteria-row">
            <div class="criteria-status ${statusClass}">${statusIcon}</div>
            <div class="criteria-id">${c.id}</div>
            <div class="criteria-desc">${c.rationale || ''}</div>
          </div>`;
    }).join('');

    return `
        <div class="criteria-header">
          <span>${p.name} (${p.passed}/${p.total})</span>
          <span class="expand-icon">▼</span>
        </div>
        <div class="criteria-content">${rows}</div>`;
  }).join('\n');
}

export function generateReport(data, outputPath = 'readiness-report.html') {
  const {
    repoName = 'unknown',
    level = 1,
    score = 0,
    total = 81,
    appsCount = 1,
    pillars = [],
    levels = [],
    actions = [],
    criteria = []
  } = data;

  const pillarDataJson = JSON.stringify(pillars.map(p => ({ name: p.name, score: p.score })));
  const levelDataJson = JSON.stringify(levels);

  let html = HTML_TEMPLATE
    .replace(/\{\{REPO_NAME\}\}/g, repoName)
    .replace(/\{\{LEVEL\}\}/g, level)
    .replace(/\{\{SCORE\}\}/g, score)
    .replace(/\{\{TOTAL\}\}/g, total)
    .replace(/\{\{APPS_COUNT\}\}/g, appsCount)
    .replace(/\{\{PILLAR_ROWS\}\}/g, generatePillarRows(pillars))
    .replace(/\{\{ACTION_ITEMS\}\}/g, generateActionItems(actions))
    .replace(/\{\{CRITERIA_SECTIONS\}\}/g, generateCriteriaSections(pillars, criteria))
    .replace(/\{\{PILLAR_DATA_JSON\}\}/g, pillarDataJson)
    .replace(/\{\{LEVEL_DATA_JSON\}\}/g, levelDataJson)
    .replace(/\{\{GENERATED_AT\}\}/g, new Date().toISOString().split('T')[0]);

  writeFileSync(outputPath, html);
  return outputPath;
}

export function generateSampleData() {
  return {
    repoName: 'my-project',
    level: 3,
    score: 45,
    total: 66,
    appsCount: 1,
    pillars: [
      { name: 'Code Quality', score: 80, passed: 6, total: 7 },
      { name: 'Build', score: 58, passed: 5, total: 8 },
      { name: 'Testing', score: 100, passed: 8, total: 8 },
      { name: 'Docs', score: 75, passed: 6, total: 8 },
      { name: 'Dev Env', score: 33, passed: 2, total: 6 },
      { name: 'Quality Gates', score: 57, passed: 4, total: 7 },
      { name: 'Security', score: 67, passed: 6, total: 9 },
      { name: 'Observability', score: 71, passed: 5, total: 7 }
    ],
    levels: [
      { level: 'L1', score: 100, achieved: true },
      { level: 'L2', score: 87, achieved: true },
      { level: 'L3', score: 50, achieved: false },
      { level: 'L4', score: 0, achieved: false },
      { level: 'L5', score: 0, achieved: false }
    ],
    actions: [
      { priority: 'HIGH', title: 'Add test coverage thresholds', description: 'Configure vitest with 80% coverage in vitest.config.ts' },
      { priority: 'HIGH', title: 'Create issue/PR templates', description: 'Add .github/ISSUE_TEMPLATE/ and PR_TEMPLATE.md' },
      { priority: 'MED', title: 'Configure Dependabot', description: 'Create .github/dependabot.yml for dependency updates' },
      { priority: 'MED', title: 'Add devcontainer', description: 'Create .devcontainer/devcontainer.json' },
      { priority: 'LOW', title: 'Enable distributed tracing', description: 'Add OpenTelemetry instrumentation' }
    ],
    criteria: [
      { pillar: 'Code Quality', id: 'lint_config', status: 'pass', rationale: 'ESLint configured' },
      { pillar: 'Code Quality', id: 'type_check', status: 'pass', rationale: 'TypeScript strict: true' },
      { pillar: 'Code Quality', id: 'formatter', status: 'pass', rationale: 'Prettier configured' },
      { pillar: 'Code Quality', id: 'pre_commit_hooks', status: 'pass', rationale: 'Husky configured' },
      { pillar: 'Code Quality', id: 'naming_consistency', status: 'pass', rationale: 'ESLint rules enforced' },
      { pillar: 'Code Quality', id: 'dead_code_detection', status: 'pass', rationale: 'no-unused-vars enabled' },
      { pillar: 'Code Quality', id: 'cyclomatic_complexity', status: 'fail', rationale: 'No complexity rules' },
      { pillar: 'Testing', id: 'unit_tests_exist', status: 'pass', rationale: '42 test files found' },
      { pillar: 'Testing', id: 'unit_tests_runnable', status: 'pass', rationale: 'yarn test works' },
      { pillar: 'Testing', id: 'integration_tests_exist', status: 'pass', rationale: 'Playwright E2E tests' },
      { pillar: 'Testing', id: 'test_coverage_thresholds', status: 'fail', rationale: 'No thresholds configured' },
      { pillar: 'Dev Env', id: 'devcontainer', status: 'fail', rationale: 'No .devcontainer found' },
      { pillar: 'Dev Env', id: 'env_template', status: 'pass', rationale: '.env.example exists' }
    ]
  };
}

// CLI entry point
if (process.argv[1].includes('generate-report')) {
  const args = process.argv.slice(2);
  const inputFile = args.find(a => !a.startsWith('-'));
  const outputFile = args.find((a, i) => args[i - 1] === '-o') || 'readiness-report.html';
  const useSample = args.includes('--sample');

  let data;

  if (useSample) {
    data = generateSampleData();
    console.log('Using sample data...');
  } else if (inputFile) {
    try {
      data = JSON.parse(readFileSync(inputFile, 'utf-8'));
    } catch (e) {
      console.error(`Error reading ${inputFile}:`, e.message);
      process.exit(1);
    }
  } else {
    console.log(`
Usage: npx claude-skill-readiness report [options]

Options:
  <input.json>     JSON file with assessment data
  -o <output.html> Output file (default: readiness-report.html)
  --sample         Generate report with sample data

Example:
  npx claude-skill-readiness report assessment.json -o report.html
  npx claude-skill-readiness report --sample
`);
    process.exit(0);
  }

  const output = generateReport(data, outputFile);
  console.log(`✓ Report generated: ${output}`);
  console.log(`  Open in browser: open ${output}`);
}
