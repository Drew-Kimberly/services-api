const { db } = require('../db');
const { servicesSeedData, versionsSeedData } = require('../db/seeders');

function registerSeedDataRoute(app) {
    app.post('/seed-data', async (_req, res) => {
        try {
            await db.Service.bulkCreate(servicesSeedData);
            await db.Version.bulkCreate(versionsSeedData);
            return res.sendStatus(200);
        } catch (e) {
            console.error('Error seeding DB data!', e);
            res.sendStatus(500);
        }
    });
}

module.exports = { registerSeedDataRoute };
