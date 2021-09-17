const SORT_DIRECTION = { ASC: 'ASC', DESC: 'DESC' };

function getSortQuery(req, options) {
    const { sortField, sortDir } = resolveSortParams(req, options);
    return [{ order: [[sortField, sortDir]] }, { sortField, sortDir: sortDir.toLowerCase() }];
}

const resolveSortParams = (req, options) => {
    const sortFieldQueryParam = req.query.sortBy;
    const sortDirectionQueryParam = req.query.sortDir;

    const sortField =
        !!sortFieldQueryParam && options.allowedFields.includes(sortFieldQueryParam)
            ? sortFieldQueryParam
            : options.defaultField;

    const sortDir =
        !!sortDirectionQueryParam && sortDirectionQueryParam.toUpperCase() in SORT_DIRECTION
            ? sortDirectionQueryParam
            : options.defaultDirection;

    return { sortField, sortDir };
};

module.exports = { getSortQuery, SORT_DIRECTION };
