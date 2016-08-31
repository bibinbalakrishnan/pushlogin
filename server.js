
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8000,function(){
	console.log('Listening on port 8000');
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
});