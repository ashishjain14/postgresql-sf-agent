'use strict';

const request = require('request-promise');
const crypto = require('crypto');
const formatUrl = require('url').format;
const logger = require('../logger');
const postgres_helper = require('../postgres_helper')


function createCredentials(postgresCredentials, parameters) {
  
  let username = crypto.randomBytes(16).toString('hex');
  let password = crypto.randomBytes(16).toString('hex');  

  return postgres_helper.getConnection(postgresCredentials)
    .task(t => {
      return t.query("CREATE USER $1:name WITH PASSWORD $2", [username, password])
        .then(() => {
          return t.query("GRANT ALL PRIVILEGES ON DATABASE $1:name to $2:name", [postgresCredentials.database, username])
        });
    })
    .then(() => {
      return {
        hosts: postgresCredentials.ips,
        hostname: postgresCredentials.host,
        port: postgresCredentials.port,
        uri: `http://${username}:${password}@${postgresCredentials.host}:${postgresCredentials.port}`,
        username: username,
        password: password
      };
    })
    .catch(error => {
      console.log('ERROR:', error)
    })
    .finally(postgres_helper.end());
  
  }

function deleteCredentials(postgresCredentials, credentials) {
  username = credentials['username'];
  return postgres_helper.getConnection(postgresCredentials)
    .task(t => {
      return t.query("Drop owned by $1:name", [username])
        .then(() => {
          return t.query("Drop role $1:name", [username])
        });
    })
    .then(() => {
      return {};
    })
    .catch(error => {
      console.log('ERROR:', error)
    })
    .finally(postgres_helper.end());
  
  }

module.exports.create = createCredentials;
module.exports.delete = deleteCredentials;