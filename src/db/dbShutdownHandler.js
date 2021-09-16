const { db } = require(".");

async function dbShutdownHandler() {
    try {
        await db.sequelize.close();
        return { isSuccessful: true };
    } catch (e) {
        return { isSuccessful: false, reason: `Failed to close the DB connection! Reason: ${e}`};
    }
}

module.exports = { dbShutdownHandler };
