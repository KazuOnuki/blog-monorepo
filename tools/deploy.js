const path = require('path');
const { spawnSync } = require('child_process');
const { root, selectSites } = require('./sites');
const { prepareSite } = require('./prepare-site');
const { runHexo } = require('./hexo');

try {
  for (const siteName of selectSites(process.argv.slice(2))) {
    console.log(`\n=== Deploying ${siteName} ===`);
    prepareSite(siteName);
    runHexo(siteName, 'clean');
    runHexo(siteName, 'generate');

    const verification = spawnSync(
      process.execPath,
      [path.join(root, 'tools', 'verify-urls.js'), siteName],
      { cwd: root, stdio: 'inherit' }
    );
    if (verification.status !== 0) {
      throw new Error(`${siteName}: deployment blocked because public paths changed`);
    }

    runHexo(siteName, 'deploy');
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
