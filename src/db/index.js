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
        try {
            const connection = await mysql.createConnection({ host, port, user, password });
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`);
            await sequelize.sync();
        } catch (e) {
            console.error('An error occurred while attempting to initialize the DB', e);
            throw e;
        }
    }

    initialized = true;
};

db.isInitialized = () => initialized;
db.sequelize = sequelize;

module.exports = { db };