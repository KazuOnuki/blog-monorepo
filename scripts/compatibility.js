'use strict';

const { slugize, stripHTML } = require('hexo-util');

if (['jpaiblog', 'jpmlblog', 'jpwdkblog'].includes(hexo.config.site_key)) {
  hexo.extend.filter.register('marked:renderer', renderer => {
    const originalHeading = renderer.heading;
    const legacyHeadingIds = {};
    renderer.heading = function(text, level) {
      const html = originalHeading.call(this, text, level);
      let oldId = slugize(stripHTML(text).trim(), { transform: this.options.modifyAnchors });
      if (legacyHeadingIds[oldId]) {
        oldId += `-${legacyHeadingIds[oldId]++}`;
      } else {
        legacyHeadingIds[oldId] = 1;
      }
      const currentIdMatch = html.match(/^<h\d id="([^"]+)"/);
      if (!currentIdMatch || currentIdMatch[1] === oldId) return html;
      return html
        .replace(`id="${currentIdMatch[1]}"`, `id="${oldId}"`)
        .replace(`href="#${currentIdMatch[1]}"`, `href="#${oldId}"`);
    };
  });
}
