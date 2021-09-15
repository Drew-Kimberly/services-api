const express = require('express');
const { createProbeRequestHandler } = require('./createProbeRequestHandler');

function createLivenessProbeRoute(probes) {
    return express.Router().get('/liveness', createProbeRequestHandler('liveness', probes));
}

module.exports = { createLivenessProbeRoute };
