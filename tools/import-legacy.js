const { spawnSync } = require('child_process');
const { root, sites, selectSites } = require('./sites');

function runGit(args, capture = false) {
  const result = spawnSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit'
  });
  if (result.status !== 0) {
    const detail = capture ? (result.stderr || result.stdout).trim() : '';
    throw new Error(`git ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`);
  }
  return capture ? result.stdout.trim() : '';
}

try {
  if (runGit(['status', '--porcelain'], true)) {
    throw new Error('The monorepo has uncommitted changes. Commit or discard them before importing legacy changes.');
  }

  for (const siteName of selectSites(process.argv.slice(2))) {
    const site = sites[siteName];
    console.log(`\n=== Importing legacy changes for ${siteName} ===`);
    runGit([
      'subtree', 'pull',
      `--prefix=${site.content}`,
      site.sourceRemote,
      'master',
      '-m', `Import legacy changes from ${site.sourceRepository}`
    ]);
  }

  console.log('\nLegacy changes are now in the monorepo. Build, verify, review, then push main.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
