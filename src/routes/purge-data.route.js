const { db } = require('../db');

function registerPurgeDataRoute(app) {
    app.post('/purge-data', async (_req, res) => {
        try {
            await db.sequelize.truncate({ cascade: true });
            return res.sendStatus(204);
        } catch (e) {
            console.error('Error purging DB data!', e);
            res.sendStatus(500);
        }
    });
}

module.exports = { registerPurgeDataRoute };
