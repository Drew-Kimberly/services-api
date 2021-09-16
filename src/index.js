const express = require('express');
const config = require('./config');
const { dbReadinessProbe } = require('./db/dbReadinessProbe');
const { registerServicesApiRoutes } = require('./api/routes');
const { registerStatusRoutes } = require('./routes/status');
const { isDevelopment } = require('./common');
const { registerSeedDataRoute } = require('./routes/seed-data.route');
const { registerPurgeDataRoute } = require('./routes/purge-data.route');

const app = express();

app.use(express.json());

registerStatusRoutes(app, [], [dbReadinessProbe]);
registerServicesApiRoutes(app);

if (isDevelopment()) {
    registerSeedDataRoute(app);
    registerPurgeDataRoute(app);
}

app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`);
});
