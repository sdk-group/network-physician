'use strict'

/* test */

var iconfig = require('../inspectors-config.json');
var Promise = require('bluebird');

/* services */

var Doctor = require('./Physician/physician.js');
var Auth = require('./Auth/auth.js');
var Queue = require('custom-queue');

var doctor = new Doctor();
var auth = new Auth();

//var ee = new EventEmitter2({
//    wildcard: false,
//    newListener: false,
//    maxListeners: 10
//});

var ee = new Queue();

doctor.setChannels({
    "event-queue": ee
});

auth.setChannels({
    "queue": ee
});


Promise.props({
    auth: auth.init(),
    doctor: doctor.init(iconfig)
}).then(function () {
    auth.start();
    doctor.start();
});

/* this will be cooler next time */

ee.on('permission.dropped', d => console.log(d));
ee.on('permission.restored', d => console.log('restored:', d));

/*Test part, ya.ru should be always up*/


setTimeout(function () {
    check();
}, 4000);

var Ip_Model = require('./Model/Permission/ip.js');


var check = function () {
    var v = auth.check([
        new Ip_Model('ya.ru').requestMessage(),
        new Ip_Model('127.1.1.1').requestMessage(),
        new Ip_Model('192.168.43.74').requestMessage()
    ]);

    console.log(v);
};

check();