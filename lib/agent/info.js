'use strict';

const logger = require('../logger');
const postgres_helper = require('../postgres_helper')

function isMaster(postgrescredentials){
return postgres_helper.getConnection(postgrescredentials)
    .task(t => {
        return t.one('select pg_is_in_recovery()');
    })
    .then(state => {return state;})
    .catch(error => {console.log('ERROR:', error)})
    .finally(postgres_helper.end());
}

module.exports.isMaster=isMaster