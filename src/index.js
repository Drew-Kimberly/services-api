const app = require('express')();
const { db } = require('./db');
const config = require('./config');

(async () => {
    await db.init();

    app.get('/', async (_req, res) => {
        try {
            await db.sequelize.authenticate();
            return res.json({ status: 'UP' });
        } catch (e) {
            console.error(e);
            return res.json({ status: 'DOWN' });
        }
    });

    app.get('/status/probes/liveness', (_req, res) => {
        return res.sendStatus(200);
    });

    app.get('/status/probes/readiness', (_req, res) => {
        if (!db.isInitialized()) {
            console.warn('Readiness probe failure! Reason: DB is not initialized');
            return res.sendStatus(503);
        }

        return res.sendStatus(200);
    });

    app.listen(config.port, () => {
        console.log(`Listening on port ${config.port}`);
    });
})();
