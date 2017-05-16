const logger = require('log4js').getLogger('send-mail');
const fetch = require('node-fetch'); // Node 7 / V5.5 didn't get fetch yet.
const FormData = require('form-data'); // Same here. Where's my fetch?!
const convertHtmlToText = require('textversionjs'); // Could use a regex, but why re-invent the wheel?

const { EMAIL_ENDPOINT, API_KEY } = require('../conf/settings');

const BASE_CONFIG = {
  method: 'POST',
  headers: {
    Authorization: `Basic ${new Buffer(API_KEY).toString('base64')}`,
    Accepts: 'application/json'
  }
};


const createFormFromData = (data) => {
  const form = new FormData();
  // Could be extended to support attachements, inlines, etc
  Object.keys(data).forEach(val => form.append(val, data[val]));

  return form;
};

const sendEmail = async (data) => {
  const { to, to_name, from, from_name, subject, body } = data;

  return fetch(EMAIL_ENDPOINT, Object.assign({}, BASE_CONFIG, {
    body: createFormFromData({
      to: `${to_name} <${to}>`,
      from: `${from_name} <${from}>`,
      subject,
      text: convertHtmlToText(body)
    })
  }))
  .then(resp => resp.ok ? Promise.resolve(resp) : Promise.reject(resp))
  .then(resp => resp.json())
  .catch(resp => logger.warn('Issue sending email: %s', resp));
};

module.exports = sendEmail;
