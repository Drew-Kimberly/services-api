module.exports = {
    port: Number(process.env.SERVICES_API_PORT) || 3100,
    database: {
        host: process.env.SERVICES_DB_HOST,
        user: process.env.SERVICES_DB_USER,
        password: process.env.SERVICES_DB_PASSWORD,
        databaseName: process.env.SERVICES_DB_NAME
    }
};
