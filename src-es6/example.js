'use strict'

/* test */

var iconfig = require('../inspectors-config.json');
var EventEmitter2 = require('eventemitter2').EventEmitter2;
var Promise = require('bluebird');

/* services */

var Doctor = require('./Physician/physician.js');
var Auth = require('./Auth/auth.js');

var doctor = new Doctor();
var auth = new Auth();

var ee = new EventEmitter2({
    wildcard: false,
    newListener: false,
    maxListeners: 10
});

doctor.setChanels({
    "event-queue": ee
});

auth.setChanels({
    "queue": ee
});

Promise.props({
    auth: auth.init(),
    doctor: doctor.init(iconfig)
}).then(function () {
    doctor.start();
    auth.start();
}).catch(function (e) {
    console.log('WTF!', e);
});

/* this will be cooler next time */

ee.on('permission.dropped', d => console.log(d));
ee.on('permission.restored', d => console.log(d));

/*Test part, ya.ru should be always up*/


setTimeout(function () {
    check();
}, 4000);

var check = function () {
    var v = auth.check([
        {
            permission: 'ip',
            key: {
                'ip': 'ya.ru'
            }
        },
        {
            permission: 'ip',
            key: {
                'ip': '192.168.43.74'
            }
        }
    ]);

    console.log(v);
};

check();