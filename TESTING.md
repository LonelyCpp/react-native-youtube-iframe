# Testing

This library is tested at three layers:

| Layer | What it verifies | How | Runner |
|-------|------------------|-----|--------|
| **unit** | Pure JS logic (`constants`, `utils`, `oEmbed`, `PlayerScripts` string generation, iframe version consistency) | Jest, `jest-environment-node` | `npm test` |
| **component** | `YoutubeIframe` React component behavior (source URI, ref methods, postMessage commands, event dispatch) with a mocked `react-native` + `WebView` | Jest + `react-test-renderer`, `jest-environment-jsdom` | `npm test` |
| **iframe** | The real player script (`MAIN_SCRIPT` / `iframe.html`): `origin`/`widget_referrer` derivation, postMessage handling, event posting, running the actual generated HTML in jsdom | Jest, `jest-environment-jsdom` | `npm test` |
| **e2e:web** | The generated iframe loaded in a real browser, driven deterministically with a mocked `YT.Player` | `test-harness/` served by `test-harness/serve.js` + `agent-device --platform web` | `npm run serve:web` |
| **e2e:app** | The Expo example app on an iOS/Android simulator, using `agent-device` for simulator control | `example/` + Expo Go + `agent-device` | see below |

## Unit / component / iframe tests

```bash
npm test                 # runs all three projects
npm run test:unit        # pure JS only
npm run test:component   # React component only
npm run test:iframe      # player script only
npm run test:watch       # watch mode
```

Coverage is collected from `src/` across all projects with `npm test -- --coverage`.

### Layout

- `jest.config.js` — three Jest projects (`unit`, `component`, `iframe`) with separate environments.
- `babel.config.js` — Babel preset for transforming the `src/` ES modules + JSX.
- `jest.setup.js` — sets `IS_REACT_ACT_ENVIRONMENT` and silences the `react-test-renderer` deprecation warning.
- `__tests__/unit`, `__tests__/component`, `__tests__/iframe`.
- `react-native` and `./WebView` are mocked in the component tests with `{virtual: true}` so the tests
  never depend on the native `react-native` / `react-native-webview` packages being installed.

## Web E2E (browser)

The `test-harness/` directory contains a self-contained page that fetches the live `iframe.html`,
injects a config plus a mocked `YT.Player` + `ReactNativeWebView` bridge, and drives the player
deterministically (no YouTube network dependency). Results render as `<h3>` headings pass/fail.

```bash
npm run serve:web        # serves test-harness at http://localhost:8123 (iframe from iframe.html)
```

Then drive it with agent-device in a real browser:

```bash
agent-device open http://localhost:8123/ --platform web
agent-device wait text "playerReady sent" 5000 --platform web      # or assert per-check
agent-device find text "PASS playerReady sent" exists --platform web
agent-device snapshot -i --platform web
agent-device close --platform web
```

`test-harness/serve.js` serves the **live** `iframe.html` as `/iframe_v2.html`, so the browser test
always exercises the current source rather than a stale generated artifact.

## App E2E (simulator)

The `example/` app is an Expo (SDK 55) project that links the library via `link:..`.

1. Install + start Metro:

   ```bash
   cd example && yarn install      # yarn is required for the `link:..` protocol
   npx expo start --port 8081      # keep this running
   ```

2. Install the **matching** Expo Go for the SDK (the installed copy must be SDK 55 or the app
   will refuse to load). If the simulator has an older Expo Go, download and install the correct one:

   ```bash
   # discover the matching client URL from the versions API:
   curl -s https://api.expo.dev/v2/versions | jq -r '.sdkVersions["55.0.0"].iosClientUrl'
   # e.g. https://github.com/expo/expo-go-releases/releases/download/Expo-Go-55.0.34/Expo-Go-55.0.34.tar.gz

   curl -L -o /tmp/ExpoGo.tar.gz "<that url>"
   mkdir -p /tmp/ExpoGo && tar -xzf /tmp/ExpoGo.tar.gz -C /tmp/ExpoGo   # extracts .app contents
   xcrun simctl install booted /tmp/ExpoGo
   ```

3. Drive with agent-device:

   ```bash
   agent-device boot --platform ios --device "iPhone 17 Pro"
   agent-device open "exp://127.0.0.1:8081" --platform ios --device "iPhone 17 Pro"
   agent-device snapshot -i --platform ios --device "iPhone 17 Pro"     # dismiss Expo Go dev menu
   agent-device press 'label="Continue"' --platform ios --device "iPhone 17 Pro"
   agent-device press 'label="Play video"' --platform ios --device "iPhone 17 Pro"  # player control
   ```

> Note: `example/metro.config.js` blocks the library root `node_modules` and forces `react`,
> `react-native`, and the webview packages to resolve from `example/node_modules`. This avoids the
> "Invalid hook call" / two-React-copies failure when the library root also contains Jest dev deps.

## Keeping the iframe version in sync

`iframe.html` is the source of truth for the served player. `src/constants.js` (`IFRAME_VERSION`)
and `iframeVersion.json` must match; `__tests__/unit/iframeConsistency.test.js` enforces this.

```bash
node -e "
const fs=require('fs');const m=require('html-minifier').minify;
const v=require('./iframeVersion.json').version;
fs.writeFileSync('./website/static/iframe_v'+v+'.html',
  m(fs.readFileSync('./iframe.html','utf8'),{collapseWhitespace:true,removeComments:true,minifyCSS:true,minifyJS:true}));
"
```
