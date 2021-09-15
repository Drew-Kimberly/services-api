const express = require('express');
const { createProbeRequestHandler } = require('./createProbeRequestHandler');

function createReadinessProbeRoute(probes) {
    return express.Router().get('/readiness', createProbeRequestHandler('readiness', probes));
}

module.exports = { createReadinessProbeRoute };
