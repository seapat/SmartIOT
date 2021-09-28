const createExpoWebpackConfigAsync = require('@expo/webpack-config');

console.log("injected")
module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  config.resolve.alias['victory-native'] = 'victory';
  return config;
};