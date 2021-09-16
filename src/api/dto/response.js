function createResponse(data, meta = {}, error = undefined) {
    const response = { data, meta };
    if (!!error) {
        response.error = error;
    }

    return response;
}

module.exports = { createResponse };
