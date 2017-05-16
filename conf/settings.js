const SETTINGS = {
  EMAIL_ENDPOINT: process.env.EMAIL_ENDPOINT ||
    'https://api.mailgun.net/v3/sandbox2790d5aaf627451eb5388877b78c4758.mailgun.org/messages',
  API_KEY: process.env.API_KEY || 'api:key-202f2708f1c149b60a5f20620898cdac'
};

// Dear ES6 Modules, where art thou?
module.exports = SETTINGS;
