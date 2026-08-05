const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const { root, sites, selectSites } = require('./sites');

function gitStatus(repository) {
  const result = spawnSync('git', ['-C', repository, 'status', '--porcelain'], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`Cannot read Git status: ${repository}`);
  return result.stdout.trim();
}

function runGit(repository, args, allowFailure = false) {
  const result = spawnSync('git', ['-C', repository, ...args], { encoding: 'utf8' });
  if (!allowFailure && result.status !== 0) {
    throw new Error(`Git command failed in ${repository}: git ${args.join(' ')}`);
  }
  return { status: result.status, output: result.stdout.trim() };
}

function contentHash(directory) {
  const hash = crypto.createHash('sha256');
  const files = [];

  function visit(current, relative = '') {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.name === '.git') continue;
      const childRelative = relative ? `${relative}/${entry.name}` : entry.name;
      const child = path.join(current, entry.name);
      if (entry.isDirectory()) visit(child, childRelative);
      else if (entry.isFile()) files.push({ child, relative: childRelative.replaceAll('\\', '/') });
    }
  }

  visit(directory);
  for (const file of files.sort((left, right) => left.relative.localeCompare(right.relative, 'en'))) {
    hash.update(file.relative);
    hash.update('\0');
    hash.update(fs.readFileSync(file.child));
    hash.update('\0');
  }
  return hash.digest('hex');
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

    runGit(target, ['fetch', '--quiet', 'origin']);
    const upstream = runGit(target, ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}'], true);
    if (upstream.status !== 0) {
      throw new Error(`Mirror target has no upstream branch: ${target}`);
    }
    const localHead = runGit(target, ['rev-parse', 'HEAD']).output;
    const remoteHead = runGit(target, ['rev-parse', upstream.output]).output;
    if (localHead !== remoteHead) {
      throw new Error(
        `Mirror target differs from ${upstream.output}; import or reconcile it before syncing: ${target}`
      );
    }

    const sourceHash = contentHash(source);
    const targetHash = contentHash(target);
    const state = runGit(target, ['config', '--get', 'blogMonorepo.lastSyncedTree'], true).output;
    if (!state && sourceHash !== targetHash) {
      throw new Error(`No mirror baseline exists and content differs; refusing to overwrite: ${target}`);
    }
    if (state && targetHash !== state && sourceHash !== targetHash) {
      throw new Error(
        `Legacy content changed since the last sync. Run npm run import:legacy -- ${siteName} first.`
      );
    }

    return { siteName, source, target, sourceHash };
  });

  for (const { siteName, source, target, sourceHash } of mirrors) {
    syncDirectory(source, target);
    runGit(target, ['config', 'blogMonorepo.lastSyncedTree', sourceHash]);
    console.log(`${siteName}: synchronized to ${target}`);
  }
  console.log('Review each mirror with git status, then commit and push through the existing workflow.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
