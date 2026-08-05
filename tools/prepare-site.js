const fs = require('fs');
const path = require('path');
const { root, sites, selectSites } = require('./sites');

function copyDirectory(source, destination) {
  fs.mkdirSync(destination, { recursive: true });
  fs.cpSync(source, destination, { recursive: true, force: true });
}

function prepareSite(siteName) {
  const site = sites[siteName];
  const contentRoot = path.join(root, site.content);
  const workRoot = path.join(root, '.build', siteName);
  const postsRoot = path.join(workRoot, 'source', '_posts');
  const faviconRoot = path.join(root, 'sites', siteName, 'favicon');

  fs.rmSync(workRoot, { recursive: true, force: true });
  fs.mkdirSync(postsRoot, { recursive: true });

  const posts = fs.readdirSync(contentRoot, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.md'))
    .sort((left, right) => left.name.localeCompare(right.name, 'en'));

  for (const post of posts) {
    fs.copyFileSync(path.join(contentRoot, post.name), path.join(postsRoot, post.name));
  }

  copyDirectory(faviconRoot, path.join(workRoot, 'source', 'favicon'));
  console.log(`${siteName}: staged ${posts.length} Markdown files`);
}

if (require.main === module) {
  try {
    for (const siteName of selectSites(process.argv.slice(2))) prepareSite(siteName);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { prepareSite };
