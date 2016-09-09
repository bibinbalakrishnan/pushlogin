
var express = require('express');
var path = require('path');
var _ = require('lodash');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _sessions = new (require('./sessions.js'));

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



/**
 * 
 * 
function Sessions(){
    this.contexts =[];
    //userid : {requester : {id: id, socket : socket}, activator :{id: id, socket: socket}, active: true, tick :20}
}
Sessions.prototype.register = function(data,socket){
    console.log('New '+data.type+' joined '+data.name);
};

Sessions.prototype.remove = function(data){
    console.log(data.type +' for '+ data.name +' cancelled');
};


Sessions.prototype.getTick = function(){

};

module.exports = Sessions;
 * 
