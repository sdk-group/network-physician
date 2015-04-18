module.exports = function (rabbit, subscribeTo) {
    return rabbit.configure({
        connection: {
            server: ['localhost']
        },
        exchanges: [
            {
                name: 'wascally-pubsub-requests-x',
                type: 'direct',
                autoDelete: true
            },
            {
                name: 'wascally-pubsub-messages-x',
                type: 'fanout',
                autoDelete: true
            }
        ],
        queues: [
            {
                name: 'wascally-pubsub-requests-q',
                autoDelete: true,
                subscribe: subscribeTo === 'requests'
            },
            {
                name: 'wascally-pubsub-messages-q',
                autoDelete: true,
                subscribe: subscribeTo === 'messages'
            },
            {
                name: 'wascally-pubsub-messages-q-2',
                autoDelete: true,
                subscribe: subscribeTo === 'messages-2'
            }
        ],
        bindings: [
            {
                exchange: 'wascally-pubsub-requests-x',
                target: 'wascally-pubsub-requests-q',
                keys: ['']
            },
            {
                exchange: 'wascally-pubsub-messages-x',
                target: 'wascally-pubsub-messages-q',
                keys: []
            },
            {
                exchange: 'wascally-pubsub-messages-x',
                target: 'wascally-pubsub-messages-q-2',
                keys: []
            }
        ]
    });
};