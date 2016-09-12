
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var _ = require('lodash');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _sessions = new (require('./sessions.js'))(io);

app.use(bodyParser.json());

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

 apiRouter.route('/login')
    .post(function(req,res){
       var reqData = req.body;
       if(reqData.username=="bibin@gmail.com" && reqData.password=="test1234"){
         res.json({"auth":"success"});
       } else {
          res.json({"auth":"fail"});
       }
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




