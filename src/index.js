const app = require('express')();
const config = require('./config');
const { dbReadinessProbe } = require('./db/dbReadinessProbe');
const { registerServicesApiRoutes } = require('./routes/api');
const { registerStatusRoutes } = require('./routes/status');
const { isDevelopment } = require('./common');
const { registerSeedDataRoute } = require('./routes/seed-data.route');

registerStatusRoutes(app, [], [dbReadinessProbe]);
registerServicesApiRoutes(app);

if (isDevelopment()) {
    registerSeedDataRoute(app);
}

app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`);
});
