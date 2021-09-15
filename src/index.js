const app = require('express')();
const config = require('./config');
const { dbReadinessProbe } = require('./db/dbReadinessProbe');
const { registerStatusRoutes } = require('./routes/status');

registerStatusRoutes(app, [], [dbReadinessProbe]);

app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`);
});
