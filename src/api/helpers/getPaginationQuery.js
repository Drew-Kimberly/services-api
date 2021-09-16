function getPaginationQuery(req, options, totalCount) {
    const { limit, offset, page, pageCount } = resolvePaginationParams(req, options, totalCount);
    const query = { limit, offset };
    const meta = {
        totalCount,
        pageCount,
        page
    };

    return [query, meta];
}

const resolvePaginationParams = (req, options, totalCount) => {
    const limitQueryParam = Number(req.query.limit);
    const pageQueryParam = Number(req.query.page);

    const limit =
        !isNaN(limitQueryParam) && limitQueryParam > 0 ? Math.min(limitQueryParam, options.limit) : options.limit;

    const pageCount = Math.ceil(totalCount / limit);

    const page =
        !isNaN(pageQueryParam) && pageQueryParam > 0 ? Math.min(pageQueryParam, pageCount) : Math.min(totalCount, 1);

    const offset = Math.max(0, (page - 1) * limit);

    return { limit, offset, page, pageCount };
};

module.exports = { getPaginationQuery };
