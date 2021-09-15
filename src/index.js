const config = require('./config');
const app = require('express')();

app.get('/', (_req, res) => {
    return res.json({ status: 'UP' });
});

app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`);
});
