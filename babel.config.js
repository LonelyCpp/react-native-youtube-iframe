module.exports = function (api) {
  if (api) {
    api.cache(false);
  }

  return {
    presets: ['module:metro-react-native-babel-preset'],
  };
};
