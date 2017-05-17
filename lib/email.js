const logger = require('log4js').getLogger('send-mail');
const fetch = require('node-fetch'); // Node 7 / V5.5 didn't get fetch yet.
const FormData = require('form-data'); // Same here. Where's my fetch?!
const convertHtmlToText = require('textversionjs'); // Could use a regex, but why re-invent the wheel?

const BASE_CONFIG = {
  method: 'POST'
};

const createFormFromData = (data) => {
  const form = new FormData();
  // Could be extended to support attachements, inlines, etc
  Object.keys(data).forEach(val => form.append(val, data[val]));

  return form;
};

class BaseSend {

  static send(data, apiKey) {
    return fetch(this.ENDPOINT, this.getConfig(data, apiKey))
      .then(resp => resp.ok ? Promise.resolve(resp) : Promise.reject(resp))
      .then(resp => resp.json())
      .catch(this.error)
      .then(this.success);
  }

  static getConfig() {
    throw new Error('Method is not implemented.');
  }

  static success() {
    throw new Error('Method is not implemented.');
  }

  static error() {
    throw new Error('Method is not implemented.');
  }
}

class Mailgun extends BaseSend {
  // no static class properties yet. :(
  static get DOMAIN() {
    return 'https://api.mailgun.net';
  }

  static get SEND_MESSAGES_PATH() {
    return '/v3/sandbox2790d5aaf627451eb5388877b78c4758.mailgun.org/messages';
  }

  static get ENDPOINT() {
    return `${this.DOMAIN}${this.SEND_MESSAGES_PATH}`;
  }

  static get ERROR_MESSAGES() {
    // TODO: More time, make this error messaging better.
    return {
      200: 'Everything worked as expected',
      400: 'Bad Request - Often missing a required parameter',
      401: 'Unauthorized - No valid API key provided',
      402: 'Request Failed - Parameters were valid but request failed',
      404: 'Not Found - The requested item doesn’t exist',
      500: 'Server Errors - something is wrong on Mailgun’s end',
      502: 'Server Errors - something is wrong on Mailgun’s end',
      503: 'Server Errors - something is wrong on Mailgun’s end',
      504: 'Server Errors - something is wrong on Mailgun’s end'
    };
  }

  static getConfig(data, apiKey) {
    const { to, to_name, from, from_name, subject, body } = data;

    return Object.assign({}, BASE_CONFIG, {
      headers: {
        Authorization: `Basic ${new Buffer(apiKey).toString('base64')}`,
        Accepts: 'application/json',
        'User-Agent': 'BrightWheel Test'
      },
      body: createFormFromData({
        to: `${to_name} <${to}>`,
        from: `${from_name} <${from}>`,
        subject,
        text: convertHtmlToText(body),
        html: body
      })
    });
  }

  static success(data) {
    // mailgun just queues data.
    return data;
  }

  static error(resp) {
    logger.warn(
      'Issues sending email: provider=mailgun :: status=%s',
      resp.status
    );

    if (resp.status === 400) {
      return resp.json().then(data => Promise.reject(data.message));
    }

    return Mailgun.ERROR_MESSAGES[resp.status];
  }
}


// NOTE: Can't completely test because of unverified domain
// https://mandrill.zendesk.com/hc/en-us/articles/205582267
// so will always get 'unsigned' as an error.
class Mandrill extends BaseSend {

  static get DOMAIN() {
    return 'https://mandrillapp.com';
  }

  static get SEND_MESSAGES_PATH() {
    return '/api/1.0./messages/send.json';
  }

  static get ENDPOINT() {
    return `${this.DOMAIN}${this.SEND_MESSAGES_PATH}`;
  }

  static getConfig(data, apiKey) {
    const { to, to_name, from, from_name, subject, body } = data;
    return Object.assign({}, BASE_CONFIG, {
      headers: {
        Accepts: 'application/json',
        'User-Agent': 'BrightWheel Test'
      },
      body: JSON.stringify({
        key: apiKey,
        message: {
          subject,
          text: convertHtmlToText(body),
          html: body,
          from_email: from,
          from_name,
          to: [{
            email: to,
            name: to_name
          }]
        }
      })
    });
  }

  static handleBulkResult(data) {
    // first result since we're only sending a single request
    const first = data[0];

    if (first.reject_reason) {
      return Promise.reject(first.reject_reason);
    }

    return data;
  }

  static success(data) {
    // mandrill returns more email information
    // basically we just care that it worked for the
    if (Array.isArray(data)) {
      return Mandrill.handleBulkResult(data);
    }

    if (data.reject_reason) {
      return Promise.reject(data);
    }

    return data;
  }

  static async error(resp) {
    // async request so we can await for the text response to repurpose.
    const response = await resp.text();
    logger.warn(
      'Error sending email to mandrill: status=%s :: error=%s',
      resp.status, response
    );

    if (resp.status === 400) {
      return Promise.reject(JSON.parse(response).message);
    }

    return Promise.reject(response);
  }
}


module.exports = {
  mailgun: Mailgun,
  mandrill: Mandrill
};
