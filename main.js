// strip tags regex: <[^>]*>


// email
// {
//   "to":
// }

const Hapi = require('hapi');
const logger = require('log4js').getLogger('main');

const PORT = 3000;

const server = new Hapi.Server();

server.connect({
  host: '0.0.0.0',
  port: PORT
});

server.route({
  method: 'POST',
  path: '/email',
  handler: (request, reply) => reply('hello world')
});

server.start((err) => {
  if (err) {
    throw err;
  }
  logger.info('Server running at: %s', server.info.uri);
});
