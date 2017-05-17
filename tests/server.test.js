const should = require('chai').should();

const requestDefaults = {
  method: 'POST',
  url: '/email',
  payload: {}
};

const errorResultNoFields = {
    "errors": [
        {
            "message": "is required",
            "name": "to"
        },
        {
            "message": "is required",
            "name": "to_name"
        },
        {
            "message": "is required",
            "name": "from"
        },
        {
            "message": "is required",
            "name": "from_name"
        },
        {
            "message": "is required",
            "name": "subject"
        },
        {
            "message": "is required",
            "name": "body"
        }
    ],
    "status": 400
};

describe('#Test server routes', () => {
  describe('#email endpoint', () => {
    it('test email data is valid', () => {
      const server = require('../lib/server');

      return server.inject(Object.assign({}, requestDefaults, {
        payload: require('./fixtures/good-email.json')
      })).then(resp => {
        resp.statusCode.should.equal(200);
        resp.result.should.deep.equal({ message: 'Message sent!' })
      })
    });

    it('test email data is bad', () => {
      const server = require('../lib/server');

      return server.inject(requestDefaults)
        .then(resp => {
          resp.statusCode.should.equal(400);
          resp.result.should.deep.equal(errorResultNoFields);
        });
    });
  });
});
