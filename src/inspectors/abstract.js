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

AbstractInspector.prototype.start = function () {
    throw Error('abstract method');
};
module.exports = AbstractInspector;