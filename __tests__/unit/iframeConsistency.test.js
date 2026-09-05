const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

describe('iframe version consistency', () => {
  it('iframeVersion.json version matches src/constants.js IFRAME_VERSION', () => {
    const versionFile = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'iframeVersion.json'), 'utf8'),
    );
    const constantsSrc = fs.readFileSync(
      path.join(ROOT, 'src', 'constants.js'),
      'utf8',
    );
    const match = constantsSrc.match(/IFRAME_VERSION\s*=\s*(\d+)/);

    expect(match).toBeTruthy();
    expect(Number(match[1])).toBe(versionFile.version);
  });

  it('iframe.html contains the message listener with capture true', () => {
    const iframe = fs.readFileSync(
      path.join(ROOT, 'iframe.html'),
      'utf8',
    );
    expect(iframe).toContain("addEventListener('message', postMessageListener");
    expect(iframe).toContain('capture: true');
  });

  it('iframe.html handles setVolume and setPlaybackRate', () => {
    const iframe = fs.readFileSync(
      path.join(ROOT, 'iframe.html'),
      'utf8',
    );
    expect(iframe).toContain("case 'setVolume'");
    expect(iframe).toContain("case 'setPlaybackRate'");
  });

  it('iframe.html includes referrer meta tag', () => {
    const iframe = fs.readFileSync(
      path.join(ROOT, 'iframe.html'),
      'utf8',
    );
    expect(iframe).toContain(
      'name="referrer" content="strict-origin-when-cross-origin"',
    );
  });

  it('generated iframe file for current version exists in website/static', () => {
    const versionFile = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'iframeVersion.json'), 'utf8'),
    );
    const generated = path.join(
      ROOT,
      'website',
      'static',
      `iframe_v${versionFile.version}.html`,
    );
    expect(fs.existsSync(generated)).toBe(true);
  });
});
