const fs = require('fs');
const path = require('path');
const { root, selectSites } = require('./sites');

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

const sourceRoot = process.argv.includes('--source')
  ? path.resolve(process.argv[process.argv.indexOf('--source') + 1])
  : path.resolve(root, '..', 'hexo');
const siteArgs = process.argv.slice(2).filter((arg, index, args) =>
  !args.includes('--source') || (arg !== '--source' && index !== args.indexOf('--source') + 1)
);
const outputRoot = path.join(root, 'baselines');
fs.mkdirSync(outputRoot, { recursive: true });

for (const siteName of selectSites(siteArgs)) {
  const source = path.join(sourceRoot, `${siteName}.github.io`, '.deploy_git');
  const paths = listPublicPaths(source);
  fs.writeFileSync(path.join(outputRoot, `${siteName}.txt`), `${paths.join('\n')}\n`);
  console.log(`${siteName}: captured ${paths.length} public paths`);
}
