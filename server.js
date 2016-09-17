
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var _ = require('lodash');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _sessions = new (require('./sessions.js'))(io);
var api = require('./api.js');
var ivr = require('./ivr.js');



app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


server.listen(process.env.PORT||8000,function(){
	console.log('Server started..');
   var ivrInfo = {};
   ivrInfo.number ="+6584680421";
   ivrInfo.user="bibin@gmail.com";
   ivr.triggerCall(ivrInfo,function(err,call){
     if(err){
        console.log("Call error: "+err);
      }
      if(call && call.sid){
        console.log("Call id : "+call.sid);
      }
   })
  _sessions.startTick();
});

app.use(express.static(path.join(__dirname, "public")));
app.use('/api', api.router);
app.use('/ivr', ivr.router(_sessions));



io.on('connection', function (socket) {
  console.log('Detected a socket connection');
  socket.on('join', function(data){
     socket.context = data;
    _sessions.register(socket);
  });
  socket.on('cancel', function(data){
    _sessions.cancel(socket);
  });
  socket.on('disconnect', function(){
    _sessions.remove(socket);
  })
  socket.on('auth-success', function(data){
    _sessions.success(socket);
  })
});




