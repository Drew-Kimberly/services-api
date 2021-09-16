const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const { initModels, Service, Version } = require('./models');
const { isDevelopment } = require('../common');
const config = require('../config');

const db = {};
const { databaseName, host, port, user, password } = config.database;
const sequelize = new Sequelize({
    dialect: 'mysql',
    database: databaseName,
    username: user,
    password,
    host
});
let initialized = false;

db.init = async () => {
    if (initialized) {
        return;
    }

    if (isDevelopment()) {
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`);
        initModels(sequelize);
        await sequelize.sync();
    } else {
        initModels(sequelize);
    }

    initialized = true;
};

db.isInitialized = () => initialized;
db.sequelize = sequelize;
db.Service = Service;
db.Version = Version;

module.exports = { db };
