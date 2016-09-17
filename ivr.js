var exports = module.exports = {};
var express = require('express');

var twilio = require('twilio');

var twilioId = process.env.twilio_id; 
var twilioToken = process.env.twilio_token;
var twilioClient;
if(process.env.NODE_ENV=="heroku"){
  console.log("Setting up twilio in heroku environment");
  console.log('Twilo Id: '+twilioId);
  console.log('Twilo Token: '+twilioToken);
  twilioClient = twilio(twilioId,twilioToken);
}
exports.router = function(Sessions){
	var avrRouter = express.Router();

  avrRouter.route('/request')
  .post(function(req,res){
      console.log("Recieved api call /ivr/request from twilio")
      var twiml = new twilio.TwimlResponse();
      twiml.gather({ numDigits: 6 ,action: '/ivr/gather', method: 'POST'}, (gatherNode) => {
        gatherNode.say('Hello Bibin, A push login request to your checkout account has been initiated. To authorize enter your 6 digits secret code now.');
      });
      res.type('text/xml');
      res.send(twiml.toString());
  });

 avrRouter.route('/gather')
  .post(function(req,res){
      console.log("Recieved api call /ivr/gather from twilio");
      var twiml = new twilio.TwimlResponse();
      if (req.body.Digits && req.body.Digits=="123456") {
       twiml.say("You have been successfully authorized");
      } else {
       twiml.say("Invalid authorization code.Your request is rejected");
      }
      res.type('text/xml');
      res.send(twiml.toString());   
  }); 

  return avrRouter;

}	

exports.triggerCall = function(ivrInfo,callback){
	console.log('Initiating call on '+ivrInfo.number);
	if(twilioClient){
	twilioClient.calls.create({ 
      to: ivrInfo.number,
      from: "+12018774298", 
      url: "https://pushlogin.herokuapp.com/ivr/request",           
	    }, function(err, call) { 
	       callback(err,call); 
	    });
	} else {
		  callback('Twilio client not available in this environment');
	}
};    
