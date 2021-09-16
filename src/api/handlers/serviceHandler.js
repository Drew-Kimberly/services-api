const { db } = require('../../db');
const { createResponse } = require('../dto/response');

const serviceHandler = {};

serviceHandler.findOne = async (req, res) => {
    const serviceId = req.params.serviceId;

    if (!serviceId || !Number(serviceId)) {
        return res.status(400).json(createResponse(null, {}, 'Invalid Service ID provided'));
    }

    try {
        const result = await db.Service.findByPk(serviceId, { include: db.Version });
        return !!result
            ? res.json(createResponse(result))
            : res.status(404).json(createResponse(null, {}, `No Service found with id=${serviceId}`));
    } catch (e) {
        console.error(e);
        return res.status(500).json(createResponse(null, {}, e.message));
    }
};

serviceHandler.findAll = async (req, res) => {
    try {
        const count = await db.Service.count();
        const result = count > 0 ? await db.Service.findAll({ include: db.Version }) : [];
        return res.json(createResponse(result, { count }));
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
        return res.status(400).json(createResponse(null, {}, 'Invalid Service ID provided'));
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
        return res.status(400).json(createResponse(null, {}, 'Invalid Service ID provided'));
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