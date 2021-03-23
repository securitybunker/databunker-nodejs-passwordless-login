const ws = require('ws');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const expressSession = require('express-session');
const expressEjsLayout = require('express-ejs-layouts')
const DataBunkerSessionStore = require('@databunker/session-store')(expressSession);
const conf = require('./conf');

const store = new DataBunkerSessionStore(conf.databunkerConf);
const sessionObj = expressSession({
  genid: function(req) {
    return uuidv4();
  },
  secret: 'JustASecret',
  resave: false,
  saveUninitialized: true,
  store
});

const app = express();
const wsServer = new ws.Server({ noServer: true });
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

wsServer.on('connection', socket => {
  socket.on('message', async function(message) {
    if (!conf.isUUID(message)) {
      socket.send('error');
      socket.close();
      return;
    }
    await sleep(conf.authTryDelay);
    return await store.get(message, async function(err, data) {
      if (err) {
        socket.send('error');
      } else if (data && data.auth && data.auth === true) {
        socket.send('done');
      } else {
        socket.send('checking');
      }
    });
  });
  socket.on('open', function open() {
    socket.send('checking');
  });
  socket.on('error', function(err) {
    console.log('Client Error :- ',err.code);
    socket.close();
  });
});

app.set('view engine','ejs');
app.use(expressEjsLayout);
app.use(sessionObj);
app.use(express.urlencoded({extended : false}));

app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

const server = app.listen(4000);

server.on('upgrade', (request, socket, head) => {
  if (request.url == '/authws') {
    console.log("request", request.url);
    wsServer.handleUpgrade(request, socket, head, socket => {
      wsServer.emit('connection', socket, request);
    });
  }
});

