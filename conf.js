module.exports = {
  databunkerConf: {
    url: 'http://localhost:3000/',
    token: 'DEMO'
  },
  nodemailerConf: {
    service: 'gmail',
    auth: {
      user: 'foo@gmail.com',
      pass: 'password'
    }
  },
  emailFrom: 'foo@gmail.com',
  host: 'http://localhost:4000',
  websocketHost: 'ws://localhost:4000',
  authTryDelay: 1000,
  isUUID: function ( uuid ) {
    let s = "" + uuid;
    s = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
    if (s === null) {
      return false;
    }
    return true;
  }
};
