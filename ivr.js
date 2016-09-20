var express = require('express');

var twilio = require('twilio');

var twilioId = process.env.twilio_id;
var twilioToken = process.env.twilio_token;
var twilioClient;
if (process.env.NODE_ENV == "heroku") {
    console.log("Setting up twilio in heroku environment");
    console.log('Twilo Id: ' + twilioId);
    console.log('Twilo Token: ' + twilioToken);
    twilioClient = twilio(twilioId, twilioToken);
};



module.exports = function (Sessions) {

    var triggerCall = function (ivrInfo) {
    console.log('Initiating call on ' + ivrInfo.user.phone);
    if (twilioClient) {
        twilioClient.calls.create({
            to: ivrInfo.user.phone,
            from: "+12018774298",
            url: "https://pushlogin.herokuapp.com/ivr/request/",
        }, function (err, call) {
            //callback(err,call);
            console.log('Call details ->error : ' + err);
            console.log('Call details -> id : ' + call);
            if(err){
                Sessions.updateIVRState(ivrInfo.user,'error');
            }
        });
    } else {
        console.log('Twilio client not available in this environment');
        Sessions.updateIVRState(ivrInfo.user,'error');
    }
};
    var avrRouter = express.Router();
    var sessionListener = Sessions.getListener();

    avrRouter.route('/request')
        .post(function (req, res) {
            console.log("Recieved api call /ivr/request from  "+req.body.Called);
            var user = Sessions.findUserByPhone(req.body.Called);
            Sessions.updateIVRState(user,'validate');
            var twiml = new twilio.TwimlResponse();
            twiml.gather({numDigits: 6, action: '/ivr/gather', method: 'POST'}, (gatherNode) => {
                gatherNode.say('Hello '+user.name+', A push login request to your checkout account has been initiated. To authorize enter your 6 digits secret code now.');
        });
    res.type('text/xml');
    res.send(twiml.toString());
}
)
;

avrRouter.route('/gather')
    .post(function (req, res) {
        console.log("Recieved api call /ivr/gather from twilio");
        var twiml = new twilio.TwimlResponse();
        var user = Sessions.findUserByPhone(req.body.Called)
        if (req.body.Digits && req.body.Digits == user.key) {
            twiml.say("You have been successfully authorized");

        } else {
            twiml.say("Invalid authorization code.Your request is rejected");
        }
        res.type('text/xml');
        res.send(twiml.toString());
    });

sessionListener.on("start.ivr", function (ivrInfo) {
    console.log('Starting IVR call...');
    triggerCall(ivrInfo);
});

 return {
    router: avrRouter
 }
}	


