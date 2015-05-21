'use strict'

var AbstractInspector = function (params, emitters) {
    this.name = 'abstract';
    this.restore = emitters.restore;
    this.drop = emitters.drop;
    this.register = emitters.register;

};

AbstractInspector.prototype.start = function () {
    throw Error('abstract method');
};

AbstractInspector.prototype.send = function (event_type, data) {
    data.inspector = this.inspector_name;
    data.name = this.permission_name;

    switch (event_type) {
    case 'drop':
        this.drop(data);
        break;
    case 'restore':
        this.restore(data)
        break;
    case 'register':
        this.register(data);
        break;
    }
};

module.exports = AbstractInspector;