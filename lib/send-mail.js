const logger = require('log4js').getLogger('send-mail');
const { EMAIL_PROVIDER, API_KEY } = require('../conf/settings');
const EmailClient = require('./email.js');

// Adding the provider and apiKey here makes it more testable.
const sendEmail = async (data, provider = EMAIL_PROVIDER, apiKey = API_KEY) => {
  const client = EmailClient[provider];

  if (client) {
    const result = await client
      .send(data, apiKey)
      .catch(message => message);

    return result;
  }

  logger.error('Email client=%s does not exist', EMAIL_PROVIDER);
  throw new Error('Email client is not supported.');
};

module.exports = sendEmail;
