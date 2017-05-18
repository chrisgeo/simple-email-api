const Hapi = require('hapi');
const sendEmail = require('./send-mail');
const validateEmail = require('./validator');

const server = new Hapi.Server();
const PORT = 3000;

server.connection({
  host: '0.0.0.0',
  port: PORT
});


server.route([{
  method: 'GET',
  path: '/',
  handler: (request, reply) => {
    reply({ message: "Yeah, yeah. I'm alive" });
  }
},
{
  method: 'POST',
  path: '/email',
  config: {
    tags: ['api'],
    description: '/email'
  },
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
}]);

module.exports = server;
