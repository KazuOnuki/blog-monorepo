const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { root, sites, selectSites } = require('./sites');

function gitStatus(repository) {
  const result = spawnSync('git', ['-C', repository, 'status', '--porcelain'], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`Cannot read Git status: ${repository}`);
  return result.stdout.trim();
}

function syncDirectory(source, target) {
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    fs.rmSync(path.join(target, entry.name), { recursive: true, force: true });
  }

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    fs.cpSync(path.join(source, entry.name), path.join(target, entry.name), {
      recursive: true,
      force: true
    });
  }
}

const args = process.argv.slice(2);
const targetIndex = args.indexOf('--target-root');
const targetRoot = targetIndex >= 0
  ? path.resolve(args[targetIndex + 1])
  : path.resolve(root, '..', 'github');
const siteArgs = args.filter((arg, index) =>
  targetIndex < 0 || (arg !== '--target-root' && index !== targetIndex + 1)
);

try {
  const selected = selectSites(siteArgs);
  const mirrors = selected.map(siteName => {
    const site = sites[siteName];
    const source = path.join(root, site.content);
    const target = path.join(targetRoot, site.sourceRepository);

    if (!fs.existsSync(path.join(target, '.git'))) {
      throw new Error(`Mirror target is not a Git repository: ${target}`);
    }
    if (gitStatus(target)) {
      throw new Error(`Mirror target has uncommitted changes; refusing to overwrite: ${target}`);
    }

    return { siteName, source, target };
  });

  for (const { siteName, source, target } of mirrors) {
    syncDirectory(source, target);
    console.log(`${siteName}: synchronized to ${target}`);
  }
  console.log('Review each mirror with git status, then commit and push through the existing workflow.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
