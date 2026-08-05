const fs = require('fs');
const path = require('path');
const { root, sites, selectSites } = require('./sites');

function listPublicPaths(directory) {
  const results = [];

  function visit(current, relative) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.name === '.git') continue;
      const childRelative = relative ? `${relative}/${entry.name}` : entry.name;
      const child = path.join(current, entry.name);
      if (entry.isDirectory()) visit(child, childRelative);
      else if (entry.isFile()) results.push(childRelative.replaceAll('\\', '/'));
    }
  }

  visit(directory, '');
  return results.sort();
}

function onlyIn(left, right) {
  const rightSet = new Set(right);
  return left.filter(item => !rightSet.has(item));
}

const args = process.argv.slice(2);
const againstIndex = args.indexOf('--against');
const againstRoot = againstIndex >= 0 ? path.resolve(args[againstIndex + 1]) : null;
const siteArgs = args.filter((arg, index) =>
  againstIndex < 0 || (arg !== '--against' && index !== againstIndex + 1)
);
let failed = false;

try {
  for (const siteName of selectSites(siteArgs)) {
    const generated = listPublicPaths(path.join(root, sites[siteName].output));
    const current = againstRoot
      ? listPublicPaths(path.join(againstRoot, `${siteName}.github.io`, '.deploy_git'))
      : fs.readFileSync(path.join(root, 'baselines', `${siteName}.txt`), 'utf8')
        .split(/\r?\n/)
        .filter(Boolean)
        .sort();
    const missing = onlyIn(current, generated);
    const added = onlyIn(generated, current);

    console.log(`${siteName}: current=${current.length}, generated=${generated.length}, missing=${missing.length}, added=${added.length}`);
    if (missing.length || added.length) {
      failed = true;
      for (const item of missing.slice(0, 20)) console.error(`  missing: ${item}`);
      for (const item of added.slice(0, 20)) console.error(`  added:   ${item}`);
      if (missing.length > 20 || added.length > 20) console.error('  (additional differences omitted)');
    }
  }
} catch (error) {
  console.error(error.message);
  failed = true;
}

if (failed) process.exitCode = 1;
