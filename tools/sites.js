const path = require('path');

const root = path.resolve(__dirname, '..');

const sites = {
  jpaiblog: {
    content: 'content/jpaiblog.github.io',
    config: 'sites/jpaiblog/_config.yml',
    output: 'dist/jpaiblog',
    sourceRepository: 'jpaiblog.github.io',
    sourceRemote: 'https://github.com/jpaiblog/jpaiblog.github.io.git'
  },
  jpiotblog: {
    content: 'content/jpiotblog.github.io',
    config: 'sites/jpiotblog/_config.yml',
    output: 'dist/jpiotblog',
    sourceRepository: 'jpiotblog.github.io',
    sourceRemote: 'https://github.com/jpiotblog/jpiotblog.github.io.git'
  },
  jpmlblog: {
    content: 'content/jpmlblog.github.io',
    config: 'sites/jpmlblog/_config.yml',
    output: 'dist/jpmlblog',
    sourceRepository: 'jpmlblog.github.io',
    sourceRemote: 'https://github.com/jpmlblog/jpmlblog.github.io.git'
  },
  jpwdkblog: {
    content: 'content/jpwdkblog.github.io',
    config: 'sites/jpwdkblog/_config.yml',
    output: 'dist/jpwdkblog',
    sourceRepository: 'jpwdkblog.github.io',
    sourceRemote: 'https://github.com/jpwdkblog/jpwdkblog.github.io.git'
  }
};

function selectSites(args) {
  const requested = args.filter(arg => !arg.startsWith('--'));
  if (requested.length === 0 || requested.includes('all')) return Object.keys(sites);

  for (const site of requested) {
    if (!sites[site]) {
      throw new Error(`Unknown site: ${site}. Expected one of: ${Object.keys(sites).join(', ')}`);
    }
  }
  return requested;
}

module.exports = { root, sites, selectSites };
