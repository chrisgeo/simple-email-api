const validate = require('jsonschema').validate;

const EMAIL_TYPE = {
  type: 'string',
  format: 'email',
  required: true
};

const MIN_STRING_TYPE = {
  type: 'string',
  minLength: 1,
  required: true
};

const EMAIL_SCHEMA = {
  id: '/Email',
  type: 'object',
  properties: {
    to: EMAIL_TYPE,
    to_name: MIN_STRING_TYPE,
    from: EMAIL_TYPE,
    from_name: MIN_STRING_TYPE,
    subject: MIN_STRING_TYPE,
    body: MIN_STRING_TYPE
  }
};


const validateEmail = (data) => {
  // TODO: Validate email with mailgun?
  const result = validate(data, EMAIL_SCHEMA);

  // for consistent-return rule.
  // Positive if statements are always
  // easier to read than if-not statements.
  if (result.valid) {
    return undefined;
  }

  // For readability, remove "instance" from result.
  return result.errors.reduce((acc, val) => {
    acc.push({
      name: val.property.replace('instance.', ''),
      message: val.message
    });
    return acc;
  }, []);
};


module.exports = validateEmail;
