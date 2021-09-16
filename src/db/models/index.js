const { init: initService, Service } = require('./Service');
const { init: initVersion, Version } = require('./Version');
const { isDevelopment } = require('../../common');

const defineAssociations = () => {
    Service.hasMany(Version, { foreignKey: 'serviceId', constraints: !isDevelopment() });
};

const initModels = sequelize => {
    initService(sequelize);
    initVersion(sequelize);
    defineAssociations();
};

module.exports = { initModels, Service, Version };
