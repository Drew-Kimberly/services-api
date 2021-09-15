function createProbeRequestHandler(type, probes) {
    return async (_req, res) => {
        for (const probe of probes) {
            const result = await probe();
            if (!result.isSuccessful) {
                if (result.reason) {
                    console.warn(`${type} probe failed! Reason: ${result.reason}`);
                }

                res.sendStatus(503);
                return;
            }
        }

        res.sendStatus(200);
    };
}

module.exports = { createProbeRequestHandler };
