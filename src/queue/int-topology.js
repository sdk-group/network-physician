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
            name: 'network-monitor-resolutions',
            type: 'direct',
            autoDelete: true
            }
        ],
    queues: [
        {
            name: 'network-monitor-resolutions-queue',
            autoDelete: true,
            subscribe: true
            }
        ],
    bindings: [
        {
            exchange: 'network-monitor-resolutions',
            target: 'network-monitor-resolutions-queue',
            keys: ['']
            }
        ]
};