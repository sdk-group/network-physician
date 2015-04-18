var rabbit = require('wascally');
var topology = require('./topology.js');

rabbit.configure(topology).then(function () {
    console.log('done');
});

rabbit.request('network-monitor-authorization', {
    type: 'authorization.request',
    expiresAfter: 2500,
    routingKey: '',
    body: {
        permisions: {
            ip: "192.168.43.74",
            external_queue: true
        }
    }
}).then(function (response) {
    response.ack();
    console.log(response.body);
});