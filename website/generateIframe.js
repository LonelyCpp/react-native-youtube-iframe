const fs = require('fs');
const minify = require('html-minifier').minify;

// Bump the version in iframeVersion.json when making breaking changes to iframe.html.
// Old versions (e.g., iframe_v2.html) must remain in website/static/ untouched
// so that users on older npm versions are not affected.
const {version: IFRAME_VERSION} = require('../iframeVersion.json');

// Validate that src/constants.js has the same version
const constantsFile = fs.readFileSync('../src/constants.js', 'utf8');
const match = constantsFile.match(/IFRAME_VERSION\s*=\s*(\d+)/);
if (!match || Number(match[1]) !== IFRAME_VERSION) {
  console.error(
    `IFRAME_VERSION mismatch: iframeVersion.json has ${IFRAME_VERSION}, ` +
      `but src/constants.js has ${match ? match[1] : 'none'}. ` +
      'Please keep them in sync.',
  );
  process.exit(1);
}

const outputFile = `./static/iframe_v${IFRAME_VERSION}.html`;
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

fs.writeFileSync(outputFile, minified);
console.log(`Generated ${outputFile}`);
