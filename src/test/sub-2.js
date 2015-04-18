var rabbit = require('wascally');

var timeout;

var started;

var received = 0;

var expected = 10;

rabbit.handle('publisher.message', function (msg) {
    console.log('Received:', JSON.stringify(msg.body));
    msg.ack();
    if ((++received) === expected) {
        received = 0;
        console.log('Received', received, 'messages after', process.hrtime(started));
    }
});

require('./topology.js')(rabbit, 'messages-2');

var requestCount = 0;

timeout = setTimeout(notifyPublisher, 3000);


function notifyPublisher() {
    console.log('Sending request', ++requestCount);

    rabbit.request('wascally-pubsub-requests-x', {
        type: 'subscriber.request',
        expiresAfter: 2500,
        routingKey: '',
        body: {
            ready: true,
            expected: expected
        }
    }).then(function (response) {
        started = process.hrtime();
        if (timeout) {
            clearTimeout(timeout);
        }
        response.ack();
        console.log('Publisher replied.');
    });
}