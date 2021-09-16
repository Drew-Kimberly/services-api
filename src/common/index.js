const config = require('../config');

const isDevelopment = () => config.nodeEnv != 'production';

module.exports = { isDevelopment };
