const { db } = require('../../db');
const { createResponse } = require('../dto/response');
const { executeCollectionQuery } = require('../helpers/executeCollectionQuery');
const { SEARCH_STRATEGY } = require('../helpers/getSearchQuery');

const serviceHandler = {};

serviceHandler.findOne = async (req, res) => {
    const serviceId = req.params.serviceId;

    if (!serviceId || !Number(serviceId)) {
        return res.status(404).json(createResponse(null, {}, `No Service found with id=${serviceId}`));
    }

    try {
        const result = await db.Service.findByPk(serviceId, {
            include: db.Version,
            order: [[db.Version, 'id', 'desc']]
        });

        return !!result
            ? res.json(createResponse(result))
            : res.status(404).json(createResponse(null, {}, `No Service found with id=${serviceId}`));
    } catch (e) {
        console.error(e);
        return res.status(500).json(createResponse(null, {}, e.message));
    }
};

serviceHandler.findAll = async (req, res) => {
    const collectionOptions = {
        sortOptions: {
            allowedFields: ['id', 'name', 'createdAt', 'updatedAt']
        },
        search: {
            fields: ['name', 'description'],
            strategy: SEARCH_STRATEGY.WILDCARD
        }
    };

    try {
        const response = await executeCollectionQuery(req, db.Service, collectionOptions, {
            include: db.Version,
            order: [[db.Version, 'id', 'desc']]
        });
        return res.json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).json(createResponse(null, {}, e.message));
    }
};

serviceHandler.create = async (req, res) => {
    const service = req.body;

    if ('id' in service) {
        return res.status(400).json(createResponse(null, {}, 'Request body must not contain an "id" field'));
    }

    try {
        const result = await db.Service.create(service, { include: db.Version });
        return res.status(201).json(createResponse(result));
    } catch (e) {
        console.error(e);
        return res.status(500).json(createResponse(null, {}, e.message));
    }
};

serviceHandler.update = async (req, res) => {
    const serviceId = req.params.serviceId;
    const serviceUpdates = req.body;

    if (!serviceId || !Number(serviceId)) {
        return res.status(404).json(createResponse(null, {}, `No Service found with id=${serviceId}`));
    }

    try {
        const existingService = await db.Service.findByPk(serviceId, { include: db.Version });
        if (existingService) {
            await db.Service.update(serviceUpdates, { where: { id: serviceId } });
            return res.sendStatus(200);
        } else {
            const newService = await db.Service.create({ ...serviceUpdates, id: serviceId }, { include: db.Version });
            return res.status(201).json(createResponse(newService));
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json(createResponse(null, {}, e.message));
    }
};

serviceHandler.delete = async (req, res) => {
    const serviceId = req.params.serviceId;

    if (!serviceId || !Number(serviceId)) {
        return res.status(404).json(createResponse(null, {}, `No Service found with id=${serviceId}`));
    }

    try {
        await db.Service.destroy({ where: { id: serviceId } });
        return res.sendStatus(204);
    } catch (e) {
        console.error(e);
        return res.status(500).json(createResponse(null, {}, e.message));
    }
};

module.exports = { serviceHandler };
