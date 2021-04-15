module.exports = {
  databunkerConf: {
    url: process.env.DATABUNKER_URL,
    token: process.env.DATABUNKER_TOKEN
  },
  nodemailerConf: {
    service: process.env.NODEMAILER_SERVICE,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS
    }
  },
  emailFrom: process.env.EMAIL_FROM,
  host: process.env.HOST,
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
