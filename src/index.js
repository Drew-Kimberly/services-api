const app = require('express')();
const config = require('./config');
const { dbReadinessProbe } = require('./db/dbReadinessProbe');
const { registerServicesApiRoutes } = require('./routes/api');
const { registerStatusRoutes } = require('./routes/status');

registerStatusRoutes(app, [], [dbReadinessProbe]);
registerServicesApiRoutes(app);

app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`);
});
