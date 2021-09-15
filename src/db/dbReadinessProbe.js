const { db } = require('./');

async function dbReadinessProbe() {
    try {
        await db.init();
    } catch (e) {
        return { isSuccessful: false, reason: `Error initializing the DB: ${e}` };
    }

    return db.isInitialized() ? { isSuccessful: true } : { isSuccessful: false, reason: 'DB is not initialized!' };
}

module.exports = { dbReadinessProbe };
