const { servicesSeedData } = require('./servicesSeedData');
const VERSIONS_PER_SERVICE = 2;

let currentServiceId = 1;
const versionsSeedData = new Array(servicesSeedData.length * VERSIONS_PER_SERVICE).fill(0).map((_, idx) => {
    if (idx > 0 && idx % VERSIONS_PER_SERVICE === 0) {
        currentServiceId++;
    }

    return { name: `v${(idx % 3) + 1}`, serviceId: currentServiceId };
});

module.exports = { versionsSeedData };
