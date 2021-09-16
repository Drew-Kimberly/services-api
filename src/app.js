const express = require('express');
const { dbReadinessProbe } = require('./db/dbReadinessProbe');
const { registerServicesApiRoutes } = require('./api/routes');
const { registerStatusRoutes } = require('./routes/status');
const { isDevelopment } = require('./common');
const { registerSeedDataRoute } = require('./routes/seed-data.route');
const { registerPurgeDataRoute } = require('./routes/purge-data.route');

const app = express();

// Middlewares
app.use(express.json());

// Routes
registerStatusRoutes(app, [], [dbReadinessProbe]);
registerServicesApiRoutes(app);

// Dev tooling
if (isDevelopment()) {
    registerSeedDataRoute(app);
    registerPurgeDataRoute(app);
}

module.exports = { app };
