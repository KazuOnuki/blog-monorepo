const { selectSites } = require('./sites');
const { prepareSite } = require('./prepare-site');
const { runHexo } = require('./hexo');

try {
  for (const siteName of selectSites(process.argv.slice(2))) {
    console.log(`\n=== Building ${siteName} ===`);
    prepareSite(siteName);
    runHexo(siteName, 'clean');
    runHexo(siteName, 'generate');
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
