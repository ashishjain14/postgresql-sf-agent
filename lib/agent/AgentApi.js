'use strict'

const request = require('request-promise');
const formatUrl = require('url').format;
const _ = require('lodash');
const pkg = require('../../package.json');
const credentials = require('./credentials');
const config = require('../config');
const logger = require('../logger');
const  errors = require('../errors');
const info = require('./info');
const InternalServerError = errors.InternalServerError;

const ips = _(config.agent.manifest.jobs)
  .chain()
  .map(job => job.networks)
  .flattenDeep()
  .map(net => net.static_ips)
  .flattenDeep()
  .value();

const postgresCredentials = _.assign(config.agent.manifest.properties.postgresql, {
  ips: ips,
  hostname: ips[0]
});

class AgentApi{

    static getInfo(req, res, next) {
    info.isMaster(postgresCredentials)
      .then(t => !t["pg_is_in_recovery"])
      .catch(() => false)
      .then(operational => {
        const baseFeatures = ['info'];
        const additionalFeatures = operational ? ['credentials'] : [];
        return _.concat(baseFeatures, additionalFeatures);
      })
      .then(supportedFeatures => res
        .status(200)
        .contentType('application/json')
        .send({
          name: `${pkg.name}-agent`,
          version: pkg.version,
          api_version: '1.1',
          supported_features: supportedFeatures
        })
      );
  }

  static createCredentials(req, res, next) {
    const args = req.body;
    logger.info(`Postgres/credentials/create: (${JSON.stringify(args)})`);

    if (!_.isPlainObject(args.parameters)) {
      return next(new BadRequest());
    }

     credentials
       .create(postgresCredentials, args.parameters)
       .then(credentials => res.status(200).contentType('application/json').send(credentials))
       .catch(error => next(new InternalServerError(error.message)));
  }

  static deleteCredentials(req, res, next) {
    const args = req.body;
    logger.info(`Postgres/credentials/delete: (${JSON.stringify(args)})`);

    if (!_.isPlainObject(args.credentials)) {
      return next(new BadRequest());
    }

    credentials
      .delete(postgresCredentials, args.credentials)
      .then(() => res.status(200).contentType('application/json').send({}))
      .catch(error => next(new InternalServerError(error.message)));
  }

}

module.exports = AgentApi;