const {getDefaultConfig} = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const libraryRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Watch the library source for live reloading
config.watchFolders = [libraryRoot];

// Ensure all dependencies resolve from the example app's node_modules, and
// that peer deps (react, react-native, webview) resolve to a SINGLE copy so
// the library and the app do not end up with two React instances.
const exampleNodeModules = path.resolve(projectRoot, 'node_modules');
config.resolver.nodeModulesPaths = [exampleNodeModules];

// Prevent Metro from resolving the library's own node_modules (the library
// keeps Jest/dev deps there). Peer deps must resolve from the example only.
config.resolver.blockList = [
  ...(config.resolver.blockList || []),
  new RegExp(path.join(libraryRoot, 'node_modules') + path.sep),
];

// Point the library import to the parent directory source
config.resolver.extraNodeModules = {
  'react-native-youtube-iframe': libraryRoot,
  react: path.join(exampleNodeModules, 'react'),
  'react-native': path.join(exampleNodeModules, 'react-native'),
  'react-native-webview': path.join(exampleNodeModules, 'react-native-webview'),
  'react-native-web-webview': path.join(
    exampleNodeModules,
    'react-native-web-webview',
  ),
};

module.exports = config;
