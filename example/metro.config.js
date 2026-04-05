const {getDefaultConfig} = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const libraryRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Watch the library source for live reloading
config.watchFolders = [libraryRoot];

// Ensure all dependencies resolve from the example app's node_modules
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')];

// Point the library import to the parent directory source
config.resolver.extraNodeModules = {
  'react-native-youtube-iframe': libraryRoot,
};

module.exports = config;
