# 019 SMS
A json wrapper API for 019 mobile xml API

### Usage

First you need to create and save a token.
You can do it by manually call `generateNewToken` function with your username and password. For example:

```javascript
const SMS = require('019sms');

SMS.generateNewToken('<username>', '<password>', '<optional sub username>')
    .then(console.log);
```

Save the token as an environment variable or in config file and use it on each request.

To send a message:

```javascript
const sender = new SMS(process.env.SMS_TOKEN, '<default source>', '<default username>');

sender({destination: '0541234567', message: 'This is a test message'})
    .then(console.log);
```
