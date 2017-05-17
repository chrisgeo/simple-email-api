// strip tags regex: <[^>]*>


// email
// {
//   "to":
// }

const Hapi = require('hapi');
const logger = require('log4js').getLogger('main');
const sendEmail = require('./lib/send-mail');
const validateEmail = require('./lib/validator');

const PORT = 3000;

const server = new Hapi.Server();

server.connection({
  host: '0.0.0.0',
  port: PORT
});

server.route({
  method: 'POST',
  path: '/email',
  handler: (request, reply) => {
    // In a bigger app business logic would be elsewhere.
    const validationErrors = validateEmail(request.payload);

    if (validationErrors) {
      return reply({ errors: validationErrors, status: 400 }).code(400);
    }

    return sendEmail(request.payload)
      .then(() => reply({ message: 'Message sent!' }))
      .catch(msg => reply({ status: 400, message: msg }).code(400));
  }
});

server.start((err) => {
  if (err) {
    throw err;
  }
  logger.info('Server running at: %s', server.info.uri);
});
