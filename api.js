var exports = module.exports = {};
var express = require('express');
var router = express.Router();

router.route('/activate')
    .get(function(req,res){
    	res.json({"books":"book"});
    });

 router.route('/login')
    .post(function(req,res){
       var reqData = req.body;
       if(reqData.username=="bibin@gmail.com" && (reqData.password=="test1234" || (reqData.token && reqData.token=="tockenId"))){
         res.json({"auth":"success"});
       } else {
          res.json({"auth":"fail"});
       }
    });   

router.route('/history')
    .get(function(req,res){
    	res.json({"user":"user1"});
    });

exports.router = router;