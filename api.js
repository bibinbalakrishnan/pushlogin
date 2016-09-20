var express = require('express');
var router = express.Router();

module.exports = function(Sessions){
    router.route('/login')
    .post(function (req, res) {
        var reqData = req.body;
        var user = Sessions.findUserByName(reqData.username);
        if (reqData.username == user.username && (reqData.password == user.password || (reqData.token && reqData.token == "tokenId"))) {
            res.json({"auth": "success"});
        } else {
            res.json({"auth": "fail"});
        }
    });

    router.route('/users')
    .post(function (req, res) {
        console.log(req.body);
        Sessions.registerUser(req.body);
        res.json({"username": req.body.username});
    })
    .get(function(req,res){
        if(req.query.name){
            console.log(req.query.name);
            res.json(Sessions.findUserByName(req.query.name));
        } else {
            var allUsers = Sessions.getUsers();
            var resp=[];
            for(user in allUsers){
                resp.push(allUsers[user]);
            }
            res.json(resp);
        }
    });


router.route('/history')
    .get(function (req, res) {
        res.json({"user": "user1"});
    });


    return {
        router : router
    }
}

