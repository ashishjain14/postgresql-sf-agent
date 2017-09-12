'use strict';

const express = require('express');
const AgentApi = require('../lib/agent/AgentApi');
const router = module.exports = express.Router();

router.route('/info')
  .get(AgentApi.getInfo);

router.route('/credentials/create')
  .post(AgentApi.createCredentials)
  .all((req, res, next) => next(new MethodNotAllowed(req.method, ['POST'])));
  
router.route('/credentials/delete')
  .post(AgentApi.deleteCredentials)
  .all((req, res, next) => next(new MethodNotAllowed(req.method, ['POST'])));