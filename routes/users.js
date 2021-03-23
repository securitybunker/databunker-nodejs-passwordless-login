const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const nodemailer = require('nodemailer');
const conf = require('../conf');


router.get('/login',(req,res)=>{
  res.render('login');
});

router.post('/check',(req,res,next)=>{
  const code = uuidv4()
  req.session.auth  = false;
  req.session.email = req.body.email;
  req.session.code  = code;
  const transporter = nodemailer.createTransport(conf.nodemailerConf);
  const url = conf.host + '/users/auth?s=' + req.sessionID + '&c=' + code;
  var mailOptions = {
    from: conf.emailFrom,
    to: req.body.email,
    subject: 'Auth url',
    text: url
  }
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  console.log('url', url)
  res.render('check', {
    'sessionid': req.sessionID,
    'websocketHost': conf.websocketHost,
  });
});

router.get('/welcome', (req,res,next)=>{
  res.render('welcome', {
    email: req.session.email,
  });
});

router.get('/auth', async (req,res)=>{
  session = req.query.s;
  code = req.query.c;
  if (!conf.isUUID(session) || !conf.isUUID(code)) {
    res.send('Error');
    console.log("error: bad session or code uuid");
    res.end();
    return;
  }
  if (req.sessionID && req.sessionID === session) {
    // user is using the same browser
    // session change here wll be saved into databunker
    if (req.session.code === code) {
      req.session.auth = true;
      res.send('OK');
    } else {
      res.send('Error');
    }
    res.end();
    return;
  }
  return await req.sessionStore.get(session, async function(err, data) {
    if (err) {
      console.log("error: ", err);
      res.send('Error');
      res.end();
      return;
    }
    if (data && data.code && data.code === code) {
      data.auth = true;
      await req.sessionStore.set(session, data, async function(err, n) {
        if (err) {
          console.log("error: ", err);
          res.send('Error');
          res.end();
        } else {
          res.send('OK');
          res.end();
        }
      });
    } else {
      console.log("error in code:", data, code);
      res.send('Error');
      res.end();
    }
  });
});

router.get('/logout',(req,res)=>{
  req.session.auth = false;
  req.session.email = '';
  res.redirect('/');
})

router.get('/valid',(req,res)=>{
  console.log(req.session);
  if (req.session.auth === true) {
    res.write('OK');
  } else {
    res.write('NOK');
  }
});

module.exports  = router;
