const SIGNALS = ['SIGTERM', 'SIGINT'];
const ERROR_EVENTS = ['uncaughtException', 'unhandledRejection'];

function registerGracefulShutdown(shutdownHandlers = []) {
    SIGNALS.forEach(signal => {
        process.on(signal, createOnShutdownFn(0, signal));
    });

    ERROR_EVENTS.forEach(event => {
        process.on(event, createOnErrorHandler(event));
    });

    function createOnErrorHandler(reason) {
        return error => {
            console.error('An unhandled error occurred!', error);
            return createOnShutdownFn(1, reason);
        };
    }

    function createOnShutdownFn(exitCode, reason) {
        return async () => {
            console.info(`Shutting down the application. Reason: ${reason}. Exit Code: ${exitCode}`);
            for (const handler of shutdownHandlers) {
                const result = await handler();
                if (!result.isSuccessful) {
                    console.error('An error occurred while gracefully stopping the app', result.reason);
                }
            }

            process.exit(exitCode);
        };
    }
}

module.exports = { registerGracefulShutdown };
