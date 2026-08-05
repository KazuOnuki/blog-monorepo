const fs = require('fs');
const path = require('path');
const { root, sites, selectSites } = require('./sites');

function walk(directory, relative = '') {
  let results = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const childRelative = relative ? `${relative}/${entry.name}` : entry.name;
    const child = path.join(directory, entry.name);
    results = entry.isDirectory()
      ? results.concat(walk(child, childRelative))
      : results.concat(childRelative);
  }
  return results;
}

function normalizeIntentionalHtmlChanges(buffer) {
  return buffer.toString('utf8')
    .replace(/<meta property="article:modified_time" content="[^"]+">/g, '<meta property="article:modified_time">')
    .replace(/(<img class='avatar waves-image'[^>]+) alt="">/g, '$1>')
    .replace(/<!--\s*-->/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/>\s+</g, '><');
}

let failed = false;
const explain = process.argv.includes('--explain');
for (const siteName of selectSites(process.argv.slice(2))) {
  const oldRoot = path.resolve(root, '..', 'hexo', `${siteName}.github.io`, '.deploy_git');
  const newRoot = path.join(root, sites[siteName].output);
  let exact = 0;
  let intentional = 0;
  const different = [];

  for (const relative of walk(newRoot)) {
    const oldContent = fs.readFileSync(path.join(oldRoot, relative));
    const newContent = fs.readFileSync(path.join(newRoot, relative));
    if (oldContent.equals(newContent)) {
      exact += 1;
    } else if (
      relative.endsWith('.html') &&
      normalizeIntentionalHtmlChanges(oldContent) === normalizeIntentionalHtmlChanges(newContent)
    ) {
      intentional += 1;
    } else {
      different.push(relative);
      if (explain && different.length === 1 && relative.endsWith('.html')) {
        const oldNormalized = normalizeIntentionalHtmlChanges(oldContent);
        const newNormalized = normalizeIntentionalHtmlChanges(newContent);
        let index = 0;
        while (index < oldNormalized.length && oldNormalized[index] === newNormalized[index]) index += 1;
        console.log(`  first difference at character ${index}`);
        console.log(`  old: ${JSON.stringify(oldNormalized.slice(Math.max(0, index - 100), index + 200))}`);
        console.log(`  new: ${JSON.stringify(newNormalized.slice(Math.max(0, index - 100), index + 200))}`);
      }
    }
  }

  console.log(`${siteName}: exact=${exact}, intentional=${intentional}, other=${different.length}`);
  for (const relative of different.slice(0, 20)) console.log(`  ${relative}`);
  if (different.length) failed = true;
}

if (failed) process.exitCode = 1;
