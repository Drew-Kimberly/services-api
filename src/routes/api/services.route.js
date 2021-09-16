const servicesRouter = require('express').Router();
const { versionsRouter } = require('./versions.route');
const { serviceHandler } = require('../../api/handlers/serviceHandler');

const COLLECTION_PATH = '/services';
const ENTITY_PATH = `${COLLECTION_PATH}/:serviceId`;

servicesRouter.get(COLLECTION_PATH, serviceHandler.findAll);
servicesRouter.post(COLLECTION_PATH, serviceHandler.create);

servicesRouter.get(ENTITY_PATH, serviceHandler.findOne);
servicesRouter.put(ENTITY_PATH, serviceHandler.update);
servicesRouter.delete(ENTITY_PATH, serviceHandler.delete);

servicesRouter.use(COLLECTION_PATH, versionsRouter);

module.exports = { servicesRouter };
