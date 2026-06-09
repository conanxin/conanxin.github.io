#!/usr/bin/env node
// Simple validation script for WWDC26 page
const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', 'projects', 'wwdc26-keynote');
let pass = 0, fail = 0;

function check(name, fn) {
  try {
    const result = fn();
    if (result) {
      console.log(`✅ ${name}`);
      pass++;
    } else {
      console.log(`❌ ${name}`);
      fail++;
    }
  } catch(e) {
    console.log(`❌ ${name}: ${e.message}`);
    fail++;
  }
}

function fileExists(p) { return fs.existsSync(path.join(BASE, p)); }
function readFile(p) { return fs.readFileSync(path.join(BASE, p), 'utf8'); }
function parseJSON(p) { return JSON.parse(readFile(p)); }

console.log('\n=== WWDC26 Page Validation ===\n');

check('index.html exists', () => fileExists('index.html'));
check('style.css exists', () => fileExists('assets/css/style.css'));
check('app.js exists', () => fileExists('assets/js/app.js'));
check('wwdc26.json exists', () => fileExists('data/wwdc26.json'));

check('wwdc26.json parses', () => {
  parseJSON('data/wwdc26.json');
  return true;
});

check('HTML has required sections', () => {
  const html = readFile('index.html');
  const sections = ['id="hero"', 'id="top10"', 'id="siri-deep"', 'id="ai-apps"', 'id="platforms"', 'id="child-safety"', 'id="performance"', 'id="developer"', 'id="availability"', 'id="analysis"', 'id="sources"'];
  return sections.every(s => html.includes(s));
});

check('HTML has interactive elements', () => {
  const html = readFile('index.html');
  return html.includes('id="platformTabs"') && html.includes('id="glassSlider"') && html.includes('id="availabilityChecker"') && html.includes('id="cmdPalette"');
});

check('CSS has responsive design', () => {
  const css = readFile('assets/css/style.css');
  return css.includes('@media') && css.includes('max-width: 768px');
});

check('CSS has dark mode support', () => {
  const css = readFile('assets/css/style.css');
  return css.includes('[data-theme="dark"]');
});

check('JS has theme toggle', () => {
  const js = readFile('assets/js/app.js');
  return js.includes('initThemeToggle') && js.includes('data-theme');
});

check('JS loads JSON data', () => {
  const js = readFile('assets/js/app.js');
  return js.includes('fetch') && js.includes('wwdc26.json');
});

check('Internal links are valid', () => {
  const html = readFile('index.html');
  const links = [...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
  return links.every(id => html.includes(`id="${id}"`));
});

check('projects/data.json updated', () => {
  const data = JSON.parse(fs.readFileSync(path.join(BASE, '..', 'data.json'), 'utf8'));
  return data.some(e => e.slug === 'wwdc26-keynote');
});

console.log(`\n=== Result: ${pass} passed, ${fail} failed ===`);
process.exit(fail > 0 ? 1 : 0);
