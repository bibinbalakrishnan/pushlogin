var express = require('express');
var router = express.Router();

module.exports = function(Sessions){
    router.route('/login')
    .post(function (req, res) {
        var reqData = req.body;
        if (reqData.username == "bibin@gmail.com" && (reqData.password == "test1234" || (reqData.token && reqData.token == "tokenId"))) {
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
        var allUsers = Sessions.getUsers();
        var resp=[];
        for(user in allUsers){
            resp.push(allUsers[user]);
        }
        res.json(resp);
    });


router.route('/history')
    .get(function (req, res) {
        res.json({"user": "user1"});
    });


    return {
        router : router
    }
}

