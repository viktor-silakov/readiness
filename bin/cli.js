#!/usr/bin/env node

import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, unlinkSync, rmdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SKILL_NAME = 'readiness';
const SKILL_FILES = ['SKILL.md', 'CRITERIA.md'];

function printHelp() {
  console.log(`
claude-skill-readiness - Install Agent Readiness skill for Claude Code

Usage:
  npx claude-skill-readiness [command]

Commands:
  install   Install skill to .claude/skills/readiness/ (default)
  check     Check if skill is already installed
  update    Update existing skill files
  remove    Remove skill from project

Examples:
  npx claude-skill-readiness
  npx claude-skill-readiness install
  npx claude-skill-readiness check
`);
}

function getTargetDir() {
  return join(process.cwd(), '.claude', 'skills', SKILL_NAME);
}

function getSourceDir() {
  return join(__dirname, '..', 'skills', SKILL_NAME);
}

function checkInstalled() {
  const targetDir = getTargetDir();
  const skillFile = join(targetDir, 'SKILL.md');
  return existsSync(skillFile);
}

function install(force = false) {
  const targetDir = getTargetDir();
  const sourceDir = getSourceDir();

  if (checkInstalled() && !force) {
    console.log('Skill already installed. Use "update" to overwrite.');
    return false;
  }

  // Create directories
  mkdirSync(targetDir, { recursive: true });

  // Copy files
  for (const file of SKILL_FILES) {
    const sourcePath = join(sourceDir, file);
    const targetPath = join(targetDir, file);

    if (!existsSync(sourcePath)) {
      console.error(`Source file not found: ${sourcePath}`);
      continue;
    }

    copyFileSync(sourcePath, targetPath);
    console.log(`  Copied ${file}`);
  }

  // Update index.md if exists
  updateIndex();

  console.log(`
Skill installed to .claude/skills/${SKILL_NAME}/

Usage in Claude Code:
  /readiness
`);
  return true;
}

function updateIndex() {
  const indexPath = join(process.cwd(), '.claude', 'skills', 'index.md');

  if (!existsSync(indexPath)) {
    // Create new index.md
    const content = `# Skills Index

- [readiness](#readiness) — [SKILL.md](./readiness/SKILL.md)

## readiness

Description: Evaluate repository readiness for autonomous AI agents. Analyzes 8 pillars, assigns maturity level 1-5, offers auto-fix.

Skill file: [./readiness/SKILL.md](./readiness/SKILL.md)
`;
    mkdirSync(dirname(indexPath), { recursive: true });
    writeFileSync(indexPath, content);
    console.log('  Created index.md');
    return;
  }

  // Check if already in index
  const content = readFileSync(indexPath, 'utf-8');
  if (content.includes('readiness')) {
    return; // Already indexed
  }

  // Add to existing index
  const indexEntry = `- [readiness](#readiness) — [SKILL.md](./readiness/SKILL.md)`;
  const sectionEntry = `
## readiness

Description: Evaluate repository readiness for autonomous AI agents. Analyzes 8 pillars, assigns maturity level 1-5, offers auto-fix.

Skill file: [./readiness/SKILL.md](./readiness/SKILL.md)
`;

  // Find Skills Index header and add entry
  let newContent = content;

  // Add to list if there's a list pattern
  const listMatch = content.match(/^- \[.+\].+$/m);
  if (listMatch) {
    const insertPos = content.indexOf(listMatch[0]) + listMatch[0].length;
    newContent = content.slice(0, insertPos) + '\n' + indexEntry + content.slice(insertPos);
  }

  // Add section at the end
  newContent = newContent.trimEnd() + '\n' + sectionEntry;

  writeFileSync(indexPath, newContent);
  console.log('  Updated index.md');
}

function remove() {
  const targetDir = getTargetDir();

  if (!checkInstalled()) {
    console.log('Skill not installed.');
    return false;
  }

  // Remove files
  for (const file of SKILL_FILES) {
    const targetPath = join(targetDir, file);
    if (existsSync(targetPath)) {
      unlinkSync(targetPath);
      console.log(`  Removed ${file}`);
    }
  }

  // Try to remove directory if empty
  try {
    rmdirSync(targetDir);
    console.log(`  Removed ${SKILL_NAME}/ directory`);
  } catch {
    // Directory not empty or other error
  }

  console.log('\nSkill removed.');
  return true;
}

// Main
const args = process.argv.slice(2);
const command = args[0] || 'install';

switch (command) {
  case 'install':
    install();
    break;
  case 'check':
    if (checkInstalled()) {
      console.log('Skill is installed.');
      process.exit(0);
    } else {
      console.log('Skill is not installed.');
      process.exit(1);
    }
    break;
  case 'update':
    install(true);
    break;
  case 'remove':
    remove();
    break;
  case '-h':
  case '--help':
  case 'help':
    printHelp();
    break;
  default:
    console.error(`Unknown command: ${command}`);
    printHelp();
    process.exit(1);
}
