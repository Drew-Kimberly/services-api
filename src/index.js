const { app } = require('./app');
const { registerGracefulShutdown } = require('./shutdown');
const { dbShutdownHandler } = require('./db/dbShutdownHandler');
const config = require('./config');

function createServerShutdownHandler(server) {
    return () => {
        return new Promise(resolve => {
            server.close(err => {
                if (err) {
                    resolve({ isSuccessful: false, reason: `Failed to shutdown the app server! Reason: ${e}` });
                } else {
                    resolve({ isSuccessful: true });
                }
            });
        });
    };
}

const server = app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`);
});

registerGracefulShutdown([dbShutdownHandler, createServerShutdownHandler(server)]);
