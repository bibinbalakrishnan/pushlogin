
var express = require('express');
var path = require('path');
var _ = require('lodash');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _sessions = new (require('./sessions.js'))(io);

server.listen(8000,function(){
	console.log('Listening on port 8000');
  _sessions.startTick();
});

app.use(express.static(path.join(__dirname, "public")));

var apiRouter = express.Router();

app.use('/api', apiRouter);

apiRouter.route('/activate')
    .get(function(req,res){
    	res.json({"books":"book"});
    });

apiRouter.route('/history')
    .get(function(req,res){
    	res.json({"user":"user1"});
    });

io.on('connection', function (socket) {
  console.log('Detected a socket connection');
  socket.on('join', function(data){
     socket.context = data;
    _sessions.register(socket);
  });
  socket.on('cancel', function(data){
    _sessions.cancel(data,socket);
  });
  socket.on('disconnect', function(){
    _sessions.remove(socket);
  })
});




