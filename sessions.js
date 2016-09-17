function Sessions(io) {
    var events = require('events');
    this.contexts = [];
    this.io = io;
    this.emitter = new events.EventEmitter();
    //userid : {data : data, requester : {id: id, socket : socket}, activator :{id: id, socket: socket}, active: true, tick :20}
}

Sessions.prototype.cancel = function (socket) {
    var data = socket.context;
    console.log('Cancel request for ' + data.name);
    var context = this.contexts[data.name];
    if (context) {
        context.active = false;
        if (data.type == "activator" && context.requester) {
            this.io.to(context.requester.id).emit('cancel-request', {});
        }
        if (data.type == "requester" && context.activator) {
            this.io.to(context.activator.id).emit('cancel-request', {});
        }
    }

};

Sessions.prototype.randomDetail = function () {
    var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    var detail = (Math.floor(Math.random() * 120) + 1) + "SGD " + date;
    var checkOutData = {};
    checkOutData.timeLeft = 30;
    checkOutData.merchant = "Qoo10 Singapore";
    checkOutData.detail = detail;
    return checkOutData;
};

Sessions.prototype.register = function (socket) {
    var data = socket.context;
    console.log('New ' + data.type + ' joined ' + data.name);
    if (data.type == 'activator') {
        var context;
        if (this.contexts[data.name]) {
            context = this.contexts[data.name];
            if (context.requester && context.active) {
                socket.emit('activate-request', context.data);
            }
        } else {
            context = {};
            this.contexts[data.name] = context;
        }
        context.activator = {};
        context.activator.id = socket.id;
        //context.socket = socket;
    } else if (data.type == 'requester') {
        var context;
        if (this.contexts[data.name]) {
            context = this.contexts[data.name];
            if (context.activator) {
                console.log('Activator exists already');
                context.data = this.randomDetail();
                console.log('Emitting activate-request to ' + context.activator.id);
                this.io.to(context.activator.id).emit('activate-request', context.data);
            }
        } else {
            console.log('Building new context for requester');
            context = {};
            context.data = this.randomDetail();
            this.contexts[data.name] = context;
        }
        context.active = true;
        context.tick = 30;
        context.requester = {};
        context.requester.id = socket.id;
        //context.socket = socket;
    }


    console.log(this.contexts);


};

Sessions.prototype.remove = function (socket) {
    if (socket.context) {
        var data = socket.context;
        console.log('Removing ' + data.type + ' for ' + data.name);
        var context = this.contexts[data.name];
        if (context && context[data.type]) {
            delete context[data.type];
            context.active = false;
            console.log(this.contexts)
        }
    }

};


Sessions.prototype.getListener = function () {
    return this.emitter;
}

Sessions.prototype.startTick = function () {
    var contexts = this.contexts;
    var io = this.io;
    var listener = this.getListener();
    setInterval(function () {
        //console.log(contexts);
        for (var ctxt in contexts) {
            var session = contexts[ctxt];
            if (session.active && session.tick > 0) {
                session.tick--;
                if (/*process.env.NODE_ENV && process.env.NODE_ENV=="heroku" &&*/ session.tick == 15 && !session.activator) {
                    console.log('Activator not available at 15th tick');
                    var ivrInfo = {};
                    ivrInfo.number = "+6584680421";
                    ivrInfo.user = "bibin@gmail.com";
                    listener.emit("start.ivr", ivrInfo);
                }
                if (session.requester) {
                    console.log('Emitting timer ' + session.tick + ' to requestor ' + session.requester.id);
                    io.to(session.requester.id).emit('countdown', session.tick);
                }
                if (session.activator) {
                    console.log('Emitting timer ' + session.tick + ' to activator ' + session.activator.id)
                    io.to(session.activator.id).emit('countdown', session.tick);
                }
            }
        }
    }, 1000);

};

Sessions.prototype.success = function (socket) {
    if (socket.context) {
        var data = socket.context;
        var context = this.contexts[data.name];
        if (context.requester) {
            this.io.to(context.requester.id).emit('auth-token', 'tockenId');
        }
        context.active = false;
        socket.emit('cancel-request', {});

    }
};

module.exports = Sessions;
 
