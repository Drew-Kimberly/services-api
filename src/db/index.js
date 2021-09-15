const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
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

    if (config.nodeEnv != 'production') {
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`);
        await sequelize.sync({ force: true });
    }

    initialized = true;
};

db.isInitialized = () => initialized;
db.sequelize = sequelize;

module.exports = { db };
