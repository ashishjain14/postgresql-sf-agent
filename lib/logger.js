'use strict';

const winston = require('winston');
const config = require('./config');

const path = config.path.logs;
const name = "postgres-agent";

const logger = new (winston.Logger)({
    transports: [new winston.transports.File({
    level: 'debug',
    filename: `${path}/${name}.log`,
    colorize: true,
    timestamp: true
})
]    
});


module.exports=logger;