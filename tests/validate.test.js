const validate = require('../lib/validator');
const should = require('chai').should();
const goodEmail = require('./fixtures/good-email.json');
const failBadToEmail = require('./fixtures/fail-bad-to-email.json');
const failMultileFields = require('./fixtures/fail-multiple-missing.json');
const failNoBody = require('./fixtures/fail-no-body.json');

describe('#POST Validation', () => {
  it('#POST JSON should validate', () => should.not.exist(validate(goodEmail)));
  describe('#POST should fail', () => {
    it('empty body', () =>
      validate(failNoBody).should.deep.equal([{
        name: 'body',
        message: 'is required'
      }])
    );
    it('multiple missing', () => validate(failMultileFields).should.deep.equal([
      {
        name: 'from_name',
        message: 'is required'
      },
      {
        name: 'body',
        message: 'is required'
      }
    ]));

    it('bad email', () => validate(failBadToEmail).should.deep.equal([{
      name: 'to',
      message: 'does not conform to the "email" format'
    }]));
  });

});
