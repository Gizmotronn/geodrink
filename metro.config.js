// Use Expo's Metro config to ensure the correct runtime polyfills and virtual entry
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
