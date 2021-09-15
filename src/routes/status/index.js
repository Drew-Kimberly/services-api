const { upRoute } = require('./up.route');
const { createLivenessProbeRoute } = require('./probes/liveness.route');
const { createReadinessProbeRoute } = require('./probes/readiness.route');

function registerStatusRoutes(app, livenessProbes = [], readinessProbes = []) {
    app.use('/status', upRoute);
    app.use('/status/probes', createLivenessProbeRoute(livenessProbes), createReadinessProbeRoute(readinessProbes));
}

module.exports = { registerStatusRoutes };
