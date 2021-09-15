const versionsRouter = require('express').Router();
const COLLECTION_PATH = '/versions';

versionsRouter.get(COLLECTION_PATH, (req, res) => res.json({ get: 'versions-collection' }));

module.exports = { versionsRouter };
