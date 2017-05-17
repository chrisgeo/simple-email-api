const SETTINGS = {
  // I prefer just using an endpoint but the two services have different
  // requirements.
  EMAIL_ENDPOINT: process.env.EMAIL_ENDPOINT ||
    'https://api.mailgun.net/v3/sandbox2790d5aaf627451eb5388877b78c4758.mailgun.org/messages',
  // TODO: Real secret store.
  API_KEY: process.env.API_KEY || 'api:key-202f2708f1c149b60a5f20620898cdac', // mandrill: aZ9nYIwqBO-7tBMaKKTHRg
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER || 'mailgun'
};

// Dear ES6 Modules, where art thou?
module.exports = SETTINGS;
