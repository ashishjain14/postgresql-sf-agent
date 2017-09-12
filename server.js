"use strict";

const config = require('./lib/config');
const app = require('./app');
const http = require('http');
const logger = require('./lib/logger')

const port = config.agent.port || '2718';
app.set('port', port);

const server = http.createServer(app);
server.listen(port);

logger.info(`Postgres Service Fabrik agent is listening on port ${port}`);