const { Op } = require('sequelize');

const SEARCH_STRATEGY = { EXACT: 'EXACT', STARTSWITH: 'STARTSWITH', WILDCARD: 'WILDCARD' };

function getSearchQuery(req, options) {
    const search = resolveSearchParam(req);
    if (!search) {
        return [{}, {}];
    }

    const { fields, strategy } = options;
    let query = {};
    switch (strategy) {
        case SEARCH_STRATEGY.EXACT:
            query = {
                [Op.or]: fields.map(field => ({ [field]: search }))
            };
            break;

        case SEARCH_STRATEGY.STARTSWITH:
            query = {
                [Op.or]: fields.map(field => ({ [field]: { [Op.startsWith]: search } }))
            };
            break;

        case SEARCH_STRATEGY.WILDCARD:
            query = {
                [Op.or]: fields.map(field => ({ [field]: { [Op.like]: `%${search}%` } }))
            };
            break;

        default:
            throw new Error(`Unsupported search strategy: ${strategy}`);
    }

    return [query, {}];
}

const resolveSearchParam = req => (!!req.query.search ? String(req.query.search) : '');

module.exports = { getSearchQuery, SEARCH_STRATEGY };
