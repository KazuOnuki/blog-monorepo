const fs = require('fs');
const path = require('path');
const { root, sites, selectSites } = require('./sites');

function walk(directory) {
  let results = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const child = path.join(directory, entry.name);
    results = entry.isDirectory() ? results.concat(walk(child)) : results.concat(child);
  }
  return results;
}

function decodeNumericEntities(value) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, decimal) => String.fromCodePoint(parseInt(decimal, 10)));
}

function normalizeUrl(siteName, value) {
  let normalized = value.startsWith('mailto:') ? decodeNumericEntities(value) : value;
  if (siteName === 'jpmlblog') {
    normalized = normalized.replace(
      '/blog/categories/Azure-Machine-Learning-Studio-classic/',
      '/blog/categories/Azure-Machine-Learning-Studio-Classic/'
    );
    normalized = normalized.replace(
      /\/blog\/2025\/04\/10\/AML_deprecate-(?:CLI|SDK)-v1\//,
      '/blog/2025/04/10/AML_deprecate-v1/'
    );
  }
  if (siteName === 'jpwdkblog') {
    normalized = normalized.replace('/blog/tags/Printer/', '/blog/tags/printer/');
  }
  return normalized;
}

function urls(siteName, html) {
  return [...html.matchAll(/(?:href|src)=['"]([^'"]+)['"]/g)]
    .map(match => normalizeUrl(siteName, match[1]))
    .sort();
}

function countValues(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
  return counts;
}

let failed = false;
for (const siteName of selectSites(process.argv.slice(2))) {
  const oldRoot = path.resolve(root, '..', 'hexo', `${siteName}.github.io`, '.deploy_git');
  const newRoot = path.join(root, sites[siteName].output);
  const htmlFiles = walk(newRoot).filter(file => file.endsWith('.html'));
  let mismatches = 0;
  let intentional = 0;

  for (const file of htmlFiles) {
    const relative = path.relative(newRoot, file);
    const oldUrls = urls(siteName, fs.readFileSync(path.join(oldRoot, relative), 'utf8'));
    const newUrls = urls(siteName, fs.readFileSync(file, 'utf8'));
    if (JSON.stringify(oldUrls) !== JSON.stringify(newUrls)) {
      const normalizedRelative = relative.replaceAll('\\', '/');
      const expectedDifference =
        (siteName === 'jpwdkblog' && normalizedRelative === 'tags/printer/index.html') ||
        (siteName === 'jpmlblog' && [
          '2025/04/10/AML_deprecate-CLI-v1/index.html',
          '2025/04/10/AML_deprecate-SDK-v1/index.html'
        ].includes(normalizedRelative));
      if (expectedDifference) {
        intentional += 1;
        continue;
      }
      mismatches += 1;
      console.error(`${siteName}: URL attribute mismatch in ${relative}`);
      if (mismatches === 1) {
        const oldCounts = countValues(oldUrls);
        const newCounts = countValues(newUrls);
        const values = [...new Set([...oldCounts.keys(), ...newCounts.keys()])].sort();
        console.error(`  old count=${oldUrls.length}, new count=${newUrls.length}`);
        for (const value of values) {
          if ((oldCounts.get(value) || 0) !== (newCounts.get(value) || 0)) {
            console.error(`  old=${oldCounts.get(value) || 0}, new=${newCounts.get(value) || 0}: ${value}`);
          }
        }
      }
    }
  }

  console.log(`${siteName}: HTML checked=${htmlFiles.length}, URL mismatches=${mismatches}, intentional=${intentional}`);
  if (mismatches) failed = true;
}

if (failed) process.exitCode = 1;
