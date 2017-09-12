'use strict';

const fs = require('fs');
const yml = require('js-yaml')

const settings_path = process.argv[2] || 'config/settings.yml';
const settings = yml.safeLoad(fs.readFileSync(settings_path, 'utf8'));

module.exports = settings;