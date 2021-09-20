# Services API

> A RESTful API for exposing service definitions

## Requirements
- [NodeJS 14.x+](https://nodejs.org/en/download/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [K8s for Docker Enabled](https://docs.docker.com/desktop/kubernetes/)
- [Helm 3.x](https://helm.sh/docs/intro/install/)
- [Tilt](https://docs.tilt.dev/install.html)
- [Curl](https://curl.se/) (suggested)
- [Postman](https://www.postman.com/downloads/) (suggested)

## Development

### Setup
Ensure all requirements (see above) are fulfilled.
Then, install dependencies locally:
```
$ yarn
```

### Running Locally
Start the app:
```
$ tilt up
```
View the Tilt Console in a browser (hit spacebar), once all resources are ready the service can be used. Verify by making a request to the healthcheck endpoint:
```
$ curl -X GET http://localhost:3100/status/up
```

### Manual Tilt Resources
The following manually triggered resources are available via the Tilt Console:

#### seed-db
Seeds test data into the database.
*Note: requires `curl`*

#### purge-db
Truncates all tables in the database.
*Note: requires `curl`*

### Connecting to the DB
As currently configured, you cannot directly connect to your local MySQL DB from your host machine. Instead, you have to connect from a Pod running on the K8s cluster. To make this easy, I added a Yarn script:
```
$ yarn mysql
```

### Common Issues

#### `"error": "Cannot read property 'hooks' of undefined"`
This error occurs when the app attempts to serve a request that requires a database query prior to the database being ready/synced. When the app is started for the first time, this error is mitigated via a readiness probe. This is all we need in real environments. However, during development Tilt live updates will cause `nodemon` to restart the app process which in turn causes the DB to be re-synced. Because of the readiness probe cadence, K8s will consider the pod "ready" and so a request that makes a DB query prior to the sync completing will throw this error.

## Testing

### Postman
Import the [Postman Collection](./postman) for the API into the Postman app. You can then explore the API and its parameters, making any requests manually.

### Integration Tests
Automated integration tests are available to run via:
```
$ yarn test:integration
```

***The integration tests are dependent on the app running locally on port 3100 in a separate process. The tests will truncate all DB data and seed the DB with fresh data prior to running.***

## Design Considerations

### Pagination / Search / Sort
- I think it's imperative to keep the implementation of generic collection handling DRY. Hence, the Service and Version collection routes declaratively configure a reusable collection query handler in `executeCollectionQuery`.
- Selectors (i.e. client only returns name/description from Service GET routes) are an additional feature that can be appended to this pattern.
- The `search` query param feature is fairly simple. A good improvement on this feature that gives a lot of power to the client is to support more advanced search queries by accepting a JSON object serialized/encoded as the parameter value. For example:
```json
{
    "AND": [
        { "name": ["LIKE", "test"] },
        { "createdAt": ["GTE", 1609462800] }
    ]
}
```
- As a rule of thumb, invalid values for these query params should not cause 4xx/5xx errors. Instead, they should be ignored or massaged to a sensible default/replacement. For example, asking for page 20 when there are only 15 pages should return data from page 15.

### Kubernetes / Helm / Docker
- I chose to introduce these technologies given my experience and their relevance. Additionally, incorporating Tilt provides a really great developer experience!

### Typescript
- I decided to forgo using TS given its setup can be cumbersome and time-consuming. This is especially true considering the adjustments needed for debugging/Docker/Tilt/Jest. In retrospect, I regret not using TS and I think it slowed down my ability to program effectively quite a bit.

### Data Validation
- The validation story for data parsed from client requests is weak, at best. This was not a high priority of mine for this exercise.
- In a production API, this is unacceptable and I would expect to see centralized validation logic applied to all routes/headers/request-bodies/query-params. 
- Validation violations should result in 4xx (generally 400) error responses returned to the client with uniformly structured error messaging.
- When using Typescript on the server, I find it advantageous to extract validation logic for a given entity into a NPM lib that can be consumed on both the client and server for a consistent end-user experience.

### Testing
- I went with utility here, trying to maximize the ratio of "value gained" to implementation time. This led me to write an integration test suite that relies on the app being locally available at port 3100 via a separate process.
- The test suite is far from comprehensive. For example, I did not spend a ton of time covering every edge case or error condition. However, I am happy with the level of confidence the suite gives me regarding the functionality of the API.
- In an ideal world, integration tests would be self-contained and idempotent. Furthermore, I would layer in other types of tests like Unit tests for more granular coverage in certain areas (graceful shutdown and k8s probes are areas that are uncovered and immediately come to mind).

### Security
- The DB used is clearly intended for local development only. This is the only scenario which operating as the root user and including a plain-text password within the codebase is acceptable.
- I did not make an effort to secure the API with AuthN / AuthZ.

### API Versioning
- I opted to not include versioning support, i.e. `/api/v1/services`. Having an answer for version management over time + breaking contract changes is very important.
