const fs = require('fs');
const minify = require('html-minifier').minify;

const iframeContent = fs.readFileSync('../iframe.html').toString();

const minified = minify(iframeContent, {
  minifyJS: true,
  minifyCSS: true,
  removeComments: true,
  useShortDoctype: true,
  removeOptionalTags: true,
  collapseWhitespace: true,
  removeTagWhitespace: true,
});

fs.writeFileSync('./static/iframe.html', minified);
