const path = require('path');
const { spawnSync } = require('child_process');
const { root, sites } = require('./sites');

function runHexo(siteName, command, extraArgs = []) {
  const hexoBin = require.resolve('hexo/bin/hexo');
  const config = path.join(root, sites[siteName].config);
  const result = spawnSync(
    process.execPath,
    [hexoBin, command, '--config', config, ...extraArgs],
    { cwd: root, stdio: 'inherit' }
  );

  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${siteName}: hexo ${command} failed with exit code ${result.status}`);
}

module.exports = { runHexo };
