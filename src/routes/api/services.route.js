const servicesRouter = require('express').Router();
const { versionsRouter } = require('./versions.route');

const COLLECTION_PATH = '/services';
const ENTITY_PATH = `${COLLECTION_PATH}/:serviceId`;

servicesRouter.get(COLLECTION_PATH, (req, res) => res.json({ get: 'services-collection' }));
servicesRouter.post(COLLECTION_PATH, (req, res) => res.json({ post: 'services-collection' }));

servicesRouter.get(ENTITY_PATH, (req, res) => res.json({ get: `service ${req.params.serviceId}` }));
servicesRouter.put(ENTITY_PATH, (req, res) => res.json({ put: `service ${req.params.serviceId}` }));
servicesRouter.delete(ENTITY_PATH, (req, res) => res.json({ delete: `service ${req.params.serviceId}` }));

servicesRouter.use(ENTITY_PATH, versionsRouter);

module.exports = { servicesRouter };
