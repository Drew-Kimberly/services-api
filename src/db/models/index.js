const { init: initService, Service } = require('./Service');
const { init: initVersion, Version } = require('./Version');

const defineAssociations = () => {
    Service.hasMany(Version, { foreignKey: 'serviceId' });
};

const initModels = sequelize => {
    initService(sequelize);
    initVersion(sequelize);
    defineAssociations();
};

module.exports = { initModels, Service, Version };
