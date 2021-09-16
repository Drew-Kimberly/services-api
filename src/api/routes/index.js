const { servicesRouter } = require('./services.route');

function registerServicesApiRoutes(app) {
    app.use('/api', servicesRouter);
}

module.exports = { registerServicesApiRoutes };
