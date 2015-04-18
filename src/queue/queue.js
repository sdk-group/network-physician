var rabbit = require('wascally');
var topology = require('./topology.js');

rabbit.configure(topology).then(function () {
    console.log('done');
});

module.exports.publish = function (data) {
    rabbit.publish('network-monitor-authorization', {
        type: 'doctor.message',
        body: data
    })
};

module.exports.handle = function (cb) {
    rabbit.handle('authorization.request', cb);
}