const axios = require('axios').default;

const baseUrl = 'http://localhost:3100/api';

describe('GET /services', () => {
    it('should return all service definitions', async () => {
        const response = await axios.get(`${baseUrl}/services`);
        expect(response.status).toEqual(200);
        expect(response.data).toMatchSnapshot();
    });

    it('should sort associated version arrays by version ID desc', async () => {
        const response = await axios.get(`${baseUrl}/services`);
        expect(response.status).toEqual(200);
        const services = response.data.data;
        services.forEach(svc => {
            let currentVersionId = Number.MAX_SAFE_INTEGER;
            svc.versions.forEach(version => {
                expect(version.id).toBeLessThan(currentVersionId);
                currentVersionId = version.id;
            });
        });
    });

    describe('search', () => {
        it('should support wildcard search by name', async () => {
            const searchTerm = 'baz';
            const response = await axios.get(`${baseUrl}/services?search=${searchTerm}`);

            expect(response.status).toEqual(200);
            const services = response.data.data;
            expect(services.length).toEqual(2);
            services.forEach(svc => {
                expect(svc.name.toLowerCase()).toEqual(expect.stringContaining(searchTerm));
            });
        });

        it('should support wildcard search by description', async () => {
            const searchTerm = 'nana';
            const response = await axios.get(`${baseUrl}/services?search=${searchTerm}`);
            expect(response.status).toEqual(200);
            const services = response.data.data;
            expect(services.length).toEqual(1);
            expect(services[0].description.toLowerCase()).toEqual(expect.stringContaining(searchTerm));
        });

        it('should return an empty result set when the search does not match', async () => {
            const searchTerm = 'does-not-exist';
            const response = await axios.get(`${baseUrl}/services?search=${searchTerm}`);
            expect(response.status).toEqual(200);
            const services = response.data.data;
            expect(services.length).toEqual(0);
        });
    });

    describe('sort', () => {
        it('should default to sort by service ID desc', async () => {
            const response = await axios.get(`${baseUrl}/services`);
            expect(response.status).toEqual(200);

            const services = response.data.data;
            let currentServiceId = Number.MAX_SAFE_INTEGER;
            services.forEach(svc => {
                expect(svc.id).toBeLessThan(currentServiceId);
                currentServiceId = svc.id;
            });
        });

        it('should change direction based on the sortDir query param', async () => {
            const response = await axios.get(`${baseUrl}/services?sortDir=asc`);
            expect(response.status).toEqual(200);

            const services = response.data.data;
            let currentServiceId = Number.MIN_SAFE_INTEGER;
            services.forEach(svc => {
                expect(svc.id).toBeGreaterThan(currentServiceId);
                currentServiceId = svc.id;
            });
        });

        it('should change direction based on the sortDir query param', async () => {
            const response = await axios.get(`${baseUrl}/services?sortDir=asc`);
            expect(response.status).toEqual(200);

            const services = response.data.data;
            let currentServiceId = Number.MIN_SAFE_INTEGER;
            services.forEach(svc => {
                expect(svc.id).toBeGreaterThan(currentServiceId);
                currentServiceId = svc.id;
            });
        });

        it('should change the field sorted by based on the sortBy query param', async () => {
            const response = await axios.get(`${baseUrl}/services?sortDir=asc&sortBy=name`);
            expect(response.status).toEqual(200);

            const services = response.data.data;
            let currentServiceName = 'a';
            services.forEach(svc => {
                expect(svc.name.localeCompare(currentServiceName)).toBeGreaterThanOrEqual(0);
                currentServiceName = svc.name;
            });
        });

        it('should not sort by unsupported fields or directions', async () => {
            const response = await axios.get(`${baseUrl}/services?sortDir=bad&sortBy=versions`);
            expect(response.status).toEqual(200);

            const services = response.data.data;
            let currentServiceId = Number.MAX_SAFE_INTEGER;
            services.forEach(svc => {
                expect(svc.id).toBeLessThan(currentServiceId);
                currentServiceId = svc.id;
            });
        });

        it('should include sort metadata in the response', async () => {
            const sortField = 'updatedAt';
            const sortDir = 'desc';
            const response = await axios.get(`${baseUrl}/services?sortDir=${sortDir}&sortBy=${sortField}`);
            expect(response.status).toEqual(200);
            expect(response.data.meta).toEqual(
                expect.objectContaining({
                    sortField,
                    sortDir
                })
            );
        });
    });

    describe('pagination', () => {
        it('should support limiting the returned results', async () => {
            const limit = 5;
            const response = await axios.get(`${baseUrl}/services?limit=${limit}`);
            expect(response.status).toEqual(200);
            expect(response.data.data.length).toEqual(limit);
        });

        it('should support paging through limited results', async () => {
            const limit = 5;
            const page1Response = await axios.get(`${baseUrl}/services?limit=${limit}&page=1`);
            expect(page1Response.status).toEqual(200);
            const page2Response = await axios.get(`${baseUrl}/services?limit=${limit}&page=2`);
            expect(page2Response.status).toEqual(200);

            expect(page1Response.data.data.length).toEqual(page2Response.data.data.length);
            expect(page1Response.data.data).not.toEqual(page2Response.data.data);
        });

        it('should return respect search and sort while paging', async () => {
            const limit = 2;
            const sortField = 'name';
            const search = 'ba';

            const page1Response = await axios.get(
                `${baseUrl}/services?limit=${limit}&page=1&sortBy=${sortField}&search=${search}`
            );
            expect(page1Response.status).toEqual(200);
            const page2Response = await axios.get(
                `${baseUrl}/services?limit=${limit}&page=2&sortBy=${sortField}&search=${search}`
            );
            expect(page2Response.status).toEqual(200);

            let currentServiceName = 'z';
            page1Response.data.data.forEach(svc => {
                expect(`${svc.name}--${svc.description}`.toLowerCase()).toEqual(expect.stringContaining(search));
                expect(svc.name.localeCompare(currentServiceName)).toBeLessThanOrEqual(0);
                currentServiceName = svc.name;
            });

            page2Response.data.data.forEach(svc => {
                expect(`${svc.name}--${svc.description}`.toLowerCase()).toEqual(expect.stringContaining(search));
                expect(svc.name.localeCompare(currentServiceName)).toBeLessThanOrEqual(0);
                currentServiceName = svc.name;
            });
        });

        it('should return remaining results when paginated to the final page', async () => {
            const totalRecords = 15; // Heavy assumption :'(
            const limit = 10;
            const lastPage = Math.ceil(totalRecords / limit);
            const expectedLastPageCount = totalRecords % limit;

            const response = await axios.get(`${baseUrl}/services?limit=${limit}&page=${lastPage}`);
            expect(response.status).toEqual(200);
            expect(response.data.data.length).toEqual(expectedLastPageCount);
        });

        it('should include pagination metadata in the response', async () => {
            const totalRecords = 15; // Heavy assumption :'(
            const limit = 5;
            const currentPage = 2;
            const response = await axios.get(`${baseUrl}/services?limit=${limit}&page=${currentPage}`);
            expect(response.status).toEqual(200);
            expect(response.data.meta).toEqual(
                expect.objectContaining({
                    returnedCount: limit,
                    totalCount: totalRecords,
                    pageCount: Math.ceil(totalRecords / limit),
                    page: currentPage
                })
            );
        });

        it('should reflect adjusted record count in metadata when search is included', async () => {
            const searchTerm = 'bar';
            const limit = 2;
            const page = 2;
            const response = await axios.get(`${baseUrl}/services?limit=${limit}&page=${page}&search=${searchTerm}`);
            expect(response.status).toEqual(200);
            expect(response.data.meta).toEqual(
                expect.objectContaining({
                    returnedCount: 1,
                    totalCount: 3,
                    pageCount: 2,
                    page
                })
            );
        });
    });
});

describe('GET /services/:serviceId', () => {
    it('should return the request service definition', async () => {
        const serviceId = 1;
        const response = await axios.get(`${baseUrl}/services/${serviceId}`);
        expect(response.status).toEqual(200);
        expect(response.data).toMatchSnapshot();
    });

    it('should sort the associated version array by version ID desc', async () => {
        const serviceId = 5;
        const response = await axios.get(`${baseUrl}/services/${serviceId}`);
        expect(response.status).toEqual(200);

        const service = response.data.data;
        let currentVersionId = Number.MAX_SAFE_INTEGER;
        service.versions.forEach(version => {
            expect(version.id).toBeLessThan(currentVersionId);
            currentVersionId = version.id;
        });
    });

    it('should return a 404 given a valid but unknown service ID', async () => {
        const serviceId = 999;
        try {
            await axios.get(`${baseUrl}/services/${serviceId}`);
        } catch (e) {
            expect(e.response.status).toEqual(404);
            return;
        }

        throw new Error('Should not reach!');
    });

    it('should return a 404 given an invalid service ID', async () => {
        const serviceId = 'should-not-be-valid';
        try {
            await axios.get(`${baseUrl}/services/${serviceId}`);
        } catch (e) {
            expect(e.response.status).toEqual(404);
            return;
        }

        throw new Error('Should not reach!');
    });
});

describe('GET /services/:serviceId/versions', () => {
    it('should return all versions for a given service', async () => {
        const serviceId = 1;
        const response = await axios.get(`${baseUrl}/services/${serviceId}/versions`);
        expect(response.status).toEqual(200);
        expect(response.data).toMatchSnapshot();
    });

    it('should return a 404 given an unknown Service ID', async () => {
        const serviceId = 321;
        try {
            await axios.get(`${baseUrl}/services/${serviceId}/versions`);
        } catch (e) {
            expect(e.response.status).toEqual(404);
            return;
        }

        throw new Error('Should not reach!');
    });

    it('should sort by Version ID DESC by default', async () => {
        const serviceId = 1;
        const response = await axios.get(`${baseUrl}/services/${serviceId}/versions`);
        expect(response.status).toEqual(200);

        const versions = response.data.data;
        let currentVersionId = Number.MAX_SAFE_INTEGER;
        versions.forEach(version => {
            expect(version.id).toBeLessThan(currentVersionId);
            currentVersionId = version.id;
        });
    });

    it('should return response metadata for sort/pagination', async () => {
        const serviceId = 1;
        const limit = 1;
        const sortField = 'name';
        const response = await axios.get(
            `${baseUrl}/services/${serviceId}/versions?limit=${limit}&sortBy=${sortField}`
        );
        expect(response.status).toEqual(200);
        expect(response.data.meta).toEqual(
            expect.objectContaining({
                returnedCount: limit,
                totalCount: 2,
                pageCount: 2,
                page: 1,
                sortDir: 'desc',
                sortField
            })
        );
    });
});

describe('POST /services', () => {
    const baseService = {
        name: 'Integration Test Service POST',
        description: 'Service created by a POST request',
        versions: []
    };

    it('should create a new service', async () => {
        const response = await axios.post(`${baseUrl}/services`, baseService);
        expect(response.status).toEqual(201);
        expect(response.data).toMatchSnapshot();

        const fetchResponse = await axios.get(`${baseUrl}/services/${response.data.data.id}`);
        expect(fetchResponse.status).toEqual(200);
        expect(response.data.data).toEqual(expect.objectContaining(baseService));
    });

    it('should throw a 400 when provided a service that already exists', async () => {
        const service = { ...baseService, id: 25 };

        try {
            await axios.post(`${baseUrl}/services`, service);
        } catch (e) {
            expect(e.response.status).toEqual(400);
            return;
        }

        throw new Error('Should not reach!');
    });

    it('should return an error response when given an empty name field', async () => {
        const service = { ...baseService, name: '' };
        await expect(() => axios.post(`${baseUrl}/services`, service)).rejects.toThrow();
    });

    it('should return an error response when a name field is too long', async () => {
        const service = { ...baseService, name: new Array(150).fill('a').join('') };
        await expect(() => axios.post(`${baseUrl}/services`, service)).rejects.toThrow();
    });

    it('should return an error response when description field is too long', async () => {
        const service = { ...baseService, name: new Array(600).fill('a').join('') };
        await expect(() => axios.post(`${baseUrl}/services`, service)).rejects.toThrow();
    });
});

describe('PUT /services/:serviceId', () => {
    const baseService = {
        name: 'Integration Test Service PUT',
        description: 'Service upserted by a PUT request',
        versions: []
    };

    it('should create a new service if that service does not exist', async () => {
        const serviceId = 17;
        const response = await axios.put(`${baseUrl}/services/${serviceId}`, baseService);
        expect(response.status).toEqual(201);

        const fetchResponse = await axios.get(`${baseUrl}/services/${serviceId}`);
        expect(fetchResponse.status).toEqual(200);
        expect(fetchResponse.data.data).toEqual(expect.objectContaining(baseService));
    });

    it('should update an existing service idempotently', async () => {
        const serviceId = 17;
        const updatedName = baseService.name + ' updated';
        const updatedService = { ...baseService, name: updatedName };

        const response1 = await axios.put(`${baseUrl}/services/${serviceId}`, updatedService);
        expect(response1.status).toEqual(200);

        const response2 = await axios.put(`${baseUrl}/services/${serviceId}`, updatedService);
        expect(response2.status).toEqual(200);

        const fetchResponse = await axios.get(`${baseUrl}/services/${serviceId}`);
        expect(fetchResponse.status).toEqual(200);
        expect(fetchResponse.data.data).toEqual(expect.objectContaining(updatedService));
    });

    it('should return a 404 given an invalid service ID', async () => {
        const serviceId = 'should-not-be-valid';
        const service = {
            name: 'test-service',
            description: 'My service created by tests',
            versions: []
        };

        try {
            await axios.put(`${baseUrl}/services/${serviceId}`, service);
        } catch (e) {
            expect(e.response.status).toEqual(404);
            return;
        }

        throw new Error('Should not reach!');
    });

    it('should return an error response when given an empty name field', async () => {
        const serviceId = 5;
        const service = { ...baseService, name: '' };
        await expect(() => axios.put(`${baseUrl}/services/${serviceId}`, service)).rejects.toThrow();
    });

    it('should return an error response when a name field is too long', async () => {
        const serviceId = 5;
        const service = { ...baseService, name: new Array(150).fill('a').join('') };
        await expect(() => axios.put(`${baseUrl}/services/${serviceId}`, service)).rejects.toThrow();
    });

    it('should return an error response when description field is too long', async () => {
        const serviceId = 5;
        const service = { ...baseService, name: new Array(600).fill('a').join('') };
        await expect(() => axios.put(`${baseUrl}/services/${serviceId}`, service)).rejects.toThrow();
    });
});

describe('DELETE /services/:serviceId', () => {
    it('should delete the specified service', async () => {
        const serviceId = 16;
        const response = await axios.delete(`${baseUrl}/services/${serviceId}`);
        expect(response.status).toEqual(204);

        try {
            await axios.get(`${baseUrl}/services/${serviceId}`);
        } catch (e) {
            expect(e.response.status).toEqual(404);
            return;
        }

        throw new Error('Should not reach!');
    });

    it('should be idempotent', async () => {
        const serviceId = 17;
        const response1 = await axios.delete(`${baseUrl}/services/${serviceId}`);
        expect(response1.status).toEqual(204);

        const response2 = await axios.delete(`${baseUrl}/services/${serviceId}`);
        expect(response2.status).toEqual(204);
    });

    it('should return a 404 given an invalid service ID', async () => {
        const serviceId = 'should-not-be-valid';
        try {
            await axios.delete(`${baseUrl}/services/${serviceId}`);
        } catch (e) {
            expect(e.response.status).toEqual(404);
            return;
        }

        throw new Error('Should not reach!');
    });
});
