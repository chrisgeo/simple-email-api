Simple Email API
=========
A simple API that sends an email.

## Requirements

- [X] Accepts input in the form of at `/email` in a `POST` request:
```javascript
 {
  “to”: “fake@example.com”,
  “to_name”: “Mr. Fake”,
  “from”: “noreply@mybrightwheel.com, “from_name”: "Brightwheel",
  “subject”: “A Message from Brightwheel, “body”: “<h1>Your Bill</h1><p>$10</p>”
}
```
- [X] Health-check-ish endpoint
- [X] Validates the above with the following rules:
  - [X] All fields are required
  - [X] `to` and `from` are emails
  - [X] `subject`, `to_name`, `from_name` are all variable fields, non-blank.
- [X] Errors are returned if validation fails
- [X] Errors are returned if email fails to send
- [X] Emails must be sent with one of two providers via HTTP POST, that are easily switchable:
  - [X] Mandrill
  - [X] Mailgun
  - [X] HTML body must be also converted to text
  - NOTE: Not so painless to use since mandrill throws unverified domains for any unassociated domain
- [X] Quality Assurance/Continuous Integration
  - [X] Docker && Docker Compose
  - [X] Unit Tests
  - [X] Integration Tests
    - NOTE: See server.test.js sends via mailgun
  - [X] Code coverage
  - [X] Linting config and auto-formatting.
- [ ] Documentation with hapi-swagger
  - Didn't work out because I didn't use JOI, I used jsonschema.

## INSTALLATION
### SETTINGS
Environment variables are used for all settings. The following can be set:

```
API_KEY (required): Needed for using the proper endpoint
EMAIL_PROVIDER: (required): `mandrill` or `mailgun` only
LOG4JS_CONFIG: Path to config file for logging
```

### DOCKER
`RECOMMEND WAY`

Download Docker for your platform from [https://www.docker.com/community-edition/](https://www.docker.com/community-edition/)


#### TO PLAY
```bash
docker run --rm -p 3000:3000 -it chrisgeorge/simple-email-api

# run tests and quiet logging
docker run --rm -e LOG4JS_CONFIG=./conf/logging.test.json -it chrisgeorge/simple-email-api npm test
```


#### DEVELOPMENT

```bash
# installs node_modules to mount from local dir
docker-compose email npm i
docker-compose up

# run tests and quite logging
docker-compuse run --rm -e LOG4JS_CONFIG=./conf/logging.test.json email npm test
```

#### NODE
Make sure you have `7.10.0+`

* Make sure you install node.js and npm
* change to repo directory

```bash
cd <path/to/repo>
npm i
# prod
# npm start
# development
npm run start-dev
```

### SEND SOMETHING
curl -d {your data} http://0.0.0.0:3000/email

## APPLICATION BREAKDOWN

### LANGUAGE
*What:* Javascript

*Pros:*
Besides being one of the languages I'm most familiar and fastest with it offers the ability, out of the box, to be asynchronous as well as scaling well horizontally.
It also has a thriving community, with lots of development being put into the platform. Let's not forgot support from a lot of large vendors.

*Cons*: Getting into ES6/7/8 is a lot easier than the original prototypical javascript but it can still be a large undertaking for those more familiar with classic OOP, or getting familiar with the legacy decisions made in the language.

### Frameworks
- *HAPI*: Invented and used by WalMart Labs with large support network. There are plenty of choices and this has a large enough, open-source ecosystem to stay around (at least for 5 years like everything else)
- *JSONSCHEMA*: Well written and formed spec for validating JSON objects with schemas. Large community and growing larger.
- *MOCHA/ISTANBUL/ETC*: Large support system, and well-formed style of testing. Supports Promise-based callbacks
- *FETCH/FORM-DATA/ETC*: These are largely used on the front-end, and are a ratified spec. Using them for conformity and convenience in a service makes logical sense instead of writing your own promise wrapper.

### MISC
The biggest pitfall of my current design, which was built with my limited time in mind, is the email client itself. Because of the requirement to be able to switch providers I ended up making static objects. What if we want to use multiple providers and accounts at the same time? What if we have multiple `api keys`? The other piece of this is the type of error handling -- each service did it vastly different and, in some cases, were inconsistent.

Another piece that should probably be addressed, and used more, is the async/await pattern. I was pretty inconsistent in using it, and doing so when it I needed it the most. It's a difficult pattern for those unfamiliar with promises to understanding, but pretty powerful over all as well. Using this pattern could more frequently could have helped a single app process scale a little better despite the learning curve to understand how the pattern works.

Documentation is something I wanted to do, and spent a bit trying to use a library to generate API docs, but it's currently something lacking and to use an automatically generated set would have required me using validation in the HTTP Server framework I chose, instead of the trusted `jsonschema`.

Testing is another places: even though I've got pretty good test coverage I'm lacking some integration tests (one threw the `server.test.js`) and have zero load-tests.

As far as feature and project management go, I probably should have tracked each requirement in github/gitlab issue tracker so folks could follow along. When I hire ICs, I tend to prefer they do work in the open so we can see how their project management skills are as well as their coding skills.

#### TL;DR
- Email Client
  * Cons:
    * Static Class Based
    * Design is scalable won't work if we want multiple providers at once with multiple api keys
    * Error handling is lacking more specific messaging for some use-cases
- Async/Await Model
  * Used sparingly and inconsistently
  * Super powerful and could have helped the app scale a single process better
- Documentation: Need more of it, didn't want to use the server framework's data validation library
- Testing:
  * No load Tests
  * Integration Test Coverage is "ok"
