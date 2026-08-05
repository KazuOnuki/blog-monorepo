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

const sourceIndex = process.argv.indexOf('--legacy-root');
const legacyRoot = sourceIndex >= 0 ? path.resolve(process.argv[sourceIndex + 1]) : null;
const siteArgs = process.argv.slice(2).filter((arg, index) =>
  sourceIndex < 0 || (arg !== '--legacy-root' && index + 2 !== sourceIndex + 1)
);
const outputRoot = path.join(root, 'baselines');
fs.mkdirSync(outputRoot, { recursive: true });

for (const siteName of selectSites(siteArgs)) {
  const source = legacyRoot
    ? path.join(legacyRoot, `${siteName}.github.io`, '.deploy_git')
    : path.join(root, sites[siteName].output);
  const paths = listPublicPaths(source);
  fs.writeFileSync(path.join(outputRoot, `${siteName}.txt`), `${paths.join('\n')}\n`);
  console.log(`${siteName}: captured ${paths.length} public paths`);
}
