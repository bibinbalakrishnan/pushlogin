
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var _ = require('lodash');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _sessions = new (require('./sessions.js'))(io);
var twilio = require('twilio');

var twilioId = process.env.twilio_id; 
var twilioToken = process.env.twilio_token;

console.log('Id: '+twilioId);
console.log('Token: '+twilioToken);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


server.listen(process.env.PORT||8000,function(){
	console.log('Listening on port 8000');
  _sessions.startTick();
});

app.use(express.static(path.join(__dirname, "public")));

var apiRouter = express.Router();

app.use('/api', apiRouter);

apiRouter.route('/voice')
  .post(function(req,res){
      console.log("Recieved api call /voice from twilio")
      var twiml = new twilio.TwimlResponse();
      twiml.gather({ numDigits: 6 ,action: '/api/gathervoice', method: 'POST'}, (gatherNode) => {
        gatherNode.say({voice:'woman'},'Hello Bibin, A push login request to your checkout account has been initiated. To authorize enter your 6 digits secret code now.');
      });
      res.type('text/xml');
      res.send(twiml.toString());
  });

 apiRouter.route('/gathervoice')
  .post(function(req,res){
      console.log("Recieved api call /gathervoice from twilio");
      var twiml = new twilio.TwimlResponse();
      if (req.body.Digits && req.body.Digits=="123456") {
       twiml.say("You have been successfully authorized");
      } else {
       twiml.say("Invalid authorization code.Your request is rejected");
      }
      res.type('text/xml');
      res.send(twiml.toString());   
  }); 

apiRouter.route('/activate')
    .get(function(req,res){
    	res.json({"books":"book"});
    });

 apiRouter.route('/login')
    .post(function(req,res){
       var reqData = req.body;
       if(reqData.username=="bibin@gmail.com" && (reqData.password=="test1234" || (reqData.token && reqData.token=="tockenId"))){
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
    _sessions.cancel(socket);
  });
  socket.on('disconnect', function(){
    _sessions.remove(socket);
  })
  socket.on('auth-success', function(data){
    _sessions.success(socket);
  })
});




