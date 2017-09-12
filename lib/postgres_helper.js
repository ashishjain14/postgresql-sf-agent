'use strict'

const promise = require('bluebird');
const options = {
    promiseLib: promise
};
const pgp = require('pg-promise')(options);
const logger = require('./logger');

function getConnection(postgresCredentials){
    var cn = {
        host: postgresCredentials.host,
        port: postgresCredentials.port,
        database: postgresCredentials.database,
        user: postgresCredentials.admin.user,
        password: postgresCredentials.admin.password
    };

    return pgp(cn);
}

function end(){
    pgp.end;
}

module.exports.getConnection = getConnection;
module.exports.end = end;