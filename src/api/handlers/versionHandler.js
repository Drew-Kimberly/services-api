const { db } = require('../../db');
const { createResponse } = require('../dto/response');
const { executeCollectionQuery } = require('../helpers/executeCollectionQuery');
const { SEARCH_STRATEGY } = require('../helpers/getSearchQuery');

const versionHandler = {};

versionHandler.findAll = async (req, res) => {
    const serviceId = req.params.serviceId;

    if (!serviceId || !Number(serviceId)) {
        return res.status(400).json(createResponse(null, {}, 'Invalid Service ID provided'));
    }

    try {
        const serviceExists = await db.Service.findByPk(serviceId);
        if (!serviceExists) {
            return res.status(404).json(createResponse(null, {}, `The Service with id=${serviceId} does not exist`));
        }

        const collectionOptions = {
            sortOptions: {
                allowedFields: ['id', 'name', 'createdAt', 'updatedAt']
            },
            search: {
                fields: ['name'],
                strategy: SEARCH_STRATEGY.WILDCARD
            }
        };

        const response = await executeCollectionQuery(req, db.Version, collectionOptions, { where: { serviceId } });
        return res.json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).json(createResponse(null, {}, e.message));
    }
};

module.exports = { versionHandler };
