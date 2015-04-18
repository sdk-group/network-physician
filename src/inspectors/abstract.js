'use strict'

var AbstractInspector = function (params, stop, start) {
    this.unhealthy = stop;
    this.healthy = start;
    var some_condition = false;
    if (!some_condition) {
        this.unhealthy('reason');
    } else {
        this.unhealthy('healthy');
    }
};

module.exports = AbstractInspector;