const merge = require('deepmerge');
const { createResponse } = require('../dto/response');
const { getSearchQuery, SEARCH_STRATEGY } = require('./getSearchQuery');
const { getPaginationQuery } = require('./getPaginationQuery');
const { getSortQuery, SORT_DIRECTION } = require('./getSortQuery');
const { isObjectEmpty } = require('../../common');

const defaultCollectionOptions = {
    pagination: {
        limit: 40
    },
    sortOptions: {
        defaultField: 'id',
        defaultDirection: SORT_DIRECTION.DESC,
        allowedFields: ['id']
    },
    search: {
        fields: [],
        strategy: SEARCH_STRATEGY.WILDCARD
    }
};

async function executeCollectionQuery(req, dbModel, collectionOptions = {}, findOptions = {}) {
    const { pagination, sortOptions, search } = mergeCollectionOptions(collectionOptions);

    const [searchQuery, searchMeta] = getSearchQuery(req, search);

    const whereClause =
        !isObjectEmpty(searchQuery) || !isObjectEmpty(findOptions.where || {})
            ? { where: merge(searchQuery, findOptions.where || {}) }
            : {};

    const count = await dbModel.count(whereClause);

    const [paginationQuery, paginationMeta] = getPaginationQuery(req, pagination, count);
    const [sortQuery, sortMeta] = getSortQuery(req, sortOptions);

    const results = await dbModel.findAll({
        ...findOptions,
        ...whereClause,
        ...paginationQuery,
        ...sortQuery
    });

    return createResponse(results, {
        returnedCount: results.length,
        ...searchMeta,
        ...paginationMeta,
        ...sortMeta
    });
}

const mergeCollectionOptions = options => merge(defaultCollectionOptions, options);

module.exports = { executeCollectionQuery };
