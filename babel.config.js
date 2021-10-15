module.exports = function (api) {
  api.cache(false);
  return {
    presets: ['module:metro-react-native-babel-preset'],
  };
};
