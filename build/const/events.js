'use strict';

var events = {
    doctor: {
        healthy: 'now.healthy',
        unhealthy: 'now.unhealthy',
        register: 'inspector.register'
    },
    permission: {
        dropped: 'permission.dropped',
        restored: 'permission.restored'
    }
};

function getEvent(service, name) {
    if (!name) {
        return events[service];
    }
    return events[service][name];
};

module.exports = getEvent;