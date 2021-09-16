const versionsRouter = require('express').Router();
const { versionHandler } = require('../../api/handlers/versionHandler');

const COLLECTION_PATH = '/:serviceId/versions';

versionsRouter.get(COLLECTION_PATH, versionHandler.findAll);

module.exports = { versionsRouter };
