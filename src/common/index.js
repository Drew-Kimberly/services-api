const config = require('../config');

const isDevelopment = () => config.nodeEnv === 'development';

const isObjectEmpty = obj => {
    if (!obj || typeof obj != 'object') {
        throw new Error(`Invalid object param: ${obj}`);
    }

    return Object.values(obj).length === 0 && Object.getOwnPropertySymbols(obj).length === 0;
};

module.exports = { isDevelopment, isObjectEmpty };
