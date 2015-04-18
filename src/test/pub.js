var rabbit = require('wascally');

rabbit.handle('subscriber.request', function (msg) {
    console.log('Got subscriber request');
    msg.reply({
        getReady: 'forawesome'
    }, 'publisher.response');
    publish(msg.body.expected);
});

require('./topology.js')(rabbit, 'requests');

function publish(total) {
    console.log(total);
    for (var i = 0; i < total; i += 1) {
        console.log('Message ' + i);
        rabbit.publish('wascally-pubsub-messages-x', {
            type: 'publisher.message',
            body: {
                message: 'Message ' + i
            }
        });
    }
}