var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _sessions = require('./sessions.js')(io);
var api = require('./api.js')(_sessions);
var ivr = require('./ivr.js')(_sessions);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


server.listen(process.env.PORT || 8000, function () {
    console.log('Server started..');
    _sessions.startTick();
});

app.use(express.static(path.join(__dirname, "public")));
app.use('/api', api.router);
app.use('/ivr', ivr.router);


io.on('connection', function (socket) {
    console.log('Detected a socket connection');
    socket.on('join', function (data) {
        socket.context = data;
        _sessions.register(socket);
    });
    socket.on('cancel', function (data) {
        _sessions.cancel(socket);
    });
    socket.on('disconnect', function () {
        _sessions.remove(socket);
    })
    socket.on('auth-success', function (data) {
        _sessions.success(socket);
    })
});




