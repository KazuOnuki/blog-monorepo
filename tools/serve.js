const { selectSites } = require('./sites');
const { prepareSite } = require('./prepare-site');
const { runHexo } = require('./hexo');

try {
  const selected = selectSites(process.argv.slice(2));
  if (selected.length !== 1) throw new Error('Preview requires exactly one site.');
  const siteName = selected[0];
  prepareSite(siteName);
  runHexo(siteName, 'server');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
