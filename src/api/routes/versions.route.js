const versionsRouter = require('express').Router();
const { versionHandler } = require('../handlers/versionHandler');

const COLLECTION_PATH = '/:serviceId/versions';

versionsRouter.get(COLLECTION_PATH, versionHandler.findAll);

module.exports = { versionsRouter };
