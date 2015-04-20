var Doctor = require('./doctor.js');
var iconfig = require('./inspectors-config.json');
//var rabbit = require('./queue/queue.js');

var doctor = new Doctor(iconfig);

doctor.on('now.unhealthy', function (data) {
    console.log('unhealthy:', data);
});

doctor.on('now.healthy', function (data) {
    console.log('healthy:', data);
});
/*
rabbit.handle(function (msg) {
    console.log('Got authorization request');
    console.log(msg.body);
    msg.reply({
        getReady: 'forawesome'
    }, 'authorization.response');
    publish(msg.body.expected);
});*/