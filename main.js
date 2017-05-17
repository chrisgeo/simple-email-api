const logger = require('log4js').getLogger('main');
const server = require('./lib/server');

if (!module.parent) {
  server.start((err) => {
    if (err) {
      throw err;
    }
    logger.info('Server running at: %s', server.info.uri);
  });
}
