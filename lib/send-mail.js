const logger = require('log4js').getLogger('send-mail');
const { EMAIL_PROVIDER, API_KEY } = require('../conf/settings');
const EmailClient = require('./email.js');

// Adding the provider and apiKey here makes it more testable.
// NOTE: without domain verification, sending to the sandbox only
// works with a direct function call.
const sendEmail = (data, provider = EMAIL_PROVIDER, apiKey = API_KEY) => {
  logger.debug(
    'provider=%s :: apiKey=%s :: data=%s',
    provider, apiKey, JSON.stringify(data));

  const client = EmailClient[provider];

  if (client) {
    return client.send(data, apiKey);
  }

  logger.error('Email client=%s does not exist', EMAIL_PROVIDER);
  throw new Error('Email client is not supported.');
};

module.exports = sendEmail;
