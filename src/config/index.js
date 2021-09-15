module.exports = {
    port: Number(process.env.SERVICES_API_PORT) || 3100,
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
        host: process.env.SERVICES_DB_HOST,
        port: process.env.SERVICES_DB_PORT,
        user: process.env.SERVICES_DB_USER,
        password: process.env.SERVICES_DB_PASSWORD,
        databaseName: process.env.SERVICES_DB_NAME
    }
};
