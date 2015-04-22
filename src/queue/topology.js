module.exports = {
    connection: {
        server: ['localhost']
    },
    exchanges: [
        {
            name: 'iris-system-events',
            type: 'fanout',
            autoDelete: true
            },
        {
            name: 'network-monitor-authorization',
            type: 'direct',
            autoDelete: true
            }
        ],
    queues: [
        {
            name: 'network-monitor-authorization-queue',
            autoDelete: true,
            subscribe: true
            }
        ],
    bindings: [
        {
            exchange: 'network-monitor-authorization',
            target: 'network-monitor-authorization-queue',
            keys: ['']
            }
        ]
};