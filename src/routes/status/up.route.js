const upRoute = require('express').Router();

upRoute.get('/up', (_req, res) => {
    return res.json({ status: 'UP' });
});

module.exports = { upRoute };
