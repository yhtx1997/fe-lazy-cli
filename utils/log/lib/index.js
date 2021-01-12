'use strict';

const log = require('npmlog');

log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info';
log.heading = 'fe-lazy-cli';
log.headingStyle = { fg: 'white', bg: 'blue' };
log.addLevel('success', 2000, { fg: 'green' });

module.exports = log;