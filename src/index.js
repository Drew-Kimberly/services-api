const config = require('./config');
const app = require('express')();

app.get('/', (_req, res) => {
    return res.json({ status: 'UP' });
});

app.get('/status/probes/liveness', (_req, res) => {
    return res.sendStatus(200);
});

app.get('/status/probes/readiness', (_req, res) => {
    return res.sendStatus(200);
});

app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`);
});
