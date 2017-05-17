const nock = require('nock');

describe('#Test Emails', () => {
  const emailData = require('./fixtures/good-email.json');

  describe("Mailgun Tests", () => {
    const mailgun = require('../lib/email').mailgun;

    it('mailgun sent success', () => {
      const mailgunSuccess = require('./fixtures/mailgun-success.json');
      const mock = nock(/api\.mailgun\.net/)
        .post(mailgun.SEND_MESSAGES_PATH)
        .reply(200, mailgunSuccess)

      return mailgun
        .send(emailData, 'somerandomkey')
        .then(data => data.should.deep.equal(mailgunSuccess));
    });

    it('mailgun sent failure 400', () => {
      const failMessage = { message: 'They send a random string on failures.'};
      const mock = nock(/api\.mailgun\.net/)
        .post(mailgun.SEND_MESSAGES_PATH)
        .reply(400, failMessage)

      return mailgun
        .send(emailData, 'somerandomkey')
        .catch(msg => msg.should.equal(failMessage.message));
    });

    it('mailgun sent failure 501', () => {
      const failMessage = { message: 'They send a random string on failures.'};
      const mock = nock(/api\.mailgun\.net/)
        .post(mailgun.SEND_MESSAGES_PATH)
        .reply(501, failMessage)

      return mailgun
        .send(emailData, 'somerandomkey')
        .catch(msg => msg.should.equal(failMessage.message));
    });

    it('mailgun sent failure 502', () => {
      const failMessage = { message: 'They send a random string on failures.'};
      const mock = nock(/api\.mailgun\.net/)
        .post(mailgun.SEND_MESSAGES_PATH)
        .reply(502, failMessage)

      return mailgun
        .send(emailData, 'somerandomkey')
        .catch(msg => msg.should.equal(failMessage.message));
    });

    // Could test all the 500s and 300s.
  });

  describe("Mandrill Tests", () => {
    const mandrill = require('../lib/email').mandrill;

    it('mandrill success', () =>{
      const mandrillSucess = require('./fixtures/mandrill-success.json');
      const mock = nock(/mandrillapp\.com/)
        .post(mandrill.SEND_MESSAGES_PATH)
        .reply(200, mandrillSucess);

      return mandrill
        .send(emailData, 'somerandomkey')
        .then(data => data.should.deep.equal(mandrillSucess));
    });

    it('mandrill fail reject-reason', () =>{
      const mandrillFail = require('./fixtures/mandrill-reject.json');
      const mock = nock(/mandrillapp\.com/)
        .post(mandrill.SEND_MESSAGES_PATH)
        .reply(200, mandrillFail);

      return mandrill
        .send(emailData, 'somerandomkey')
        .catch(msg => msg.should.equal(mandrillFail[0].reject_reason));
    });

    it('mandrill 400', () =>{
      const mandrillFail = require('./fixtures/mandrill-error.json');
      const mock = nock(/mandrillapp\.com/)
        .post(mandrill.SEND_MESSAGES_PATH)
        .reply(400, mandrillFail);

      return mandrill
        .send(emailData, 'somerandomkey')
        .catch(msg => msg.should.equal(mandrillFail.message))
    });

    // Could test all the 500s and 300s.
  });

  describe('#Test sendEmail', () => {
    const sendEmail = require('../lib/send-mail');

    describe('#Test sendEmail with Mailgun', () => {
      const mailgun = require('../lib/email').mailgun;

      it('send email with mailgun: success', () => {
        const mailgunSuccess = require('./fixtures/mailgun-success.json');
        const successMock = nock(/api\.mailgun\.net/)
          .post(mailgun.SEND_MESSAGES_PATH)
          .reply(200, mailgunSuccess);

        return sendEmail(emailData, 'mailgun', 'sometestkey')
          .then(data => data.should.deep.equal(mailgunSuccess));
      });

      it('send email with mailgun: failure', () => {
        const failMessage = { message: 'They send a random string on failures.'};
        const failMock = nock(/api\.mailgun\.net/)
          .post(mailgun.SEND_MESSAGES_PATH)
          .reply(400, failMessage)

        return sendEmail(emailData, 'mailgun', 'sometestkey')
          .catch(msg => msg.should.equal(failMessage.message));
      });
    });

    describe('#Test sendEmail with Mandrill', () => {
      const mandrill = require('../lib/email').mandrill;

      it('mandrill success', () => {
        const mandrillSucess = require('./fixtures/mandrill-success.json');
        const mock = nock(/mandrillapp\.com/)
          .post(mandrill.SEND_MESSAGES_PATH)
          .reply(200, mandrillSucess);

        return sendEmail(emailData, 'mandrill', 'somerandomapikey')
          .then(data => data.should.deep.equal(mandrillSucess));
      });

      it('mandrill reject', () => {
        const mandrillFail = require('./fixtures/mandrill-reject.json');
        const mock = nock(/mandrillapp\.com/)
          .post(mandrill.SEND_MESSAGES_PATH)
          .reply(200, mandrillFail);

        return sendEmail(emailData, 'mandrill', 'somerandomapikey')
          .catch(msg => msg.should.equal(mandrillFail[0].reject_reason));
      });

      it('mandrill failure', () => {
        const mandrillFail = require('./fixtures/mandrill-error.json');
        const mock = nock(/mandrillapp\.com/)
          .post(mandrill.SEND_MESSAGES_PATH)
          .reply(400, mandrillFail);

        return sendEmail(emailData, 'mandrill', 'somerandomapikey')
          .catch(msg => msg.should.equal(mandrillFail.message));
      });
    });
  });
});
