'use strict'
var EventEmitter2 = require('eventemitter2').EventEmitter2;

var Doctor = function (config) {
    this.emitter = new EventEmitter2({
        wildcard: true,
        newListener: false,
        maxListeners: 10
    });
    this.inspectors_array = [];

    if (!config.hasOwnProperty('inspectors')) {
        config.inspectors = '*';
        //and some actions to include whole dir
    }

    var inspectors_names = config.inspectors;
    var len = inspectors_names.length;

    for (var i = 0; i < len; i += 1) {
        var inspector_params = inspectors_names[i];

        var name = inspector_params.name;
        var params = inspector_params.params;

        var Inspector_Model = require('./inspectors/' + name + '.js');
        var inspector = new Inspector_Model(params, this.notifyRestore.bind(this), this.notifyDrop.bind(this));
        inspector.start();
        this.inspectors_array.push(inspector);
    }

};

Doctor.prototype.on = function (event, listener) {
    this.emitter.on(event, listener);
};

Doctor.prototype.off = function (event, listener) {
    this.emitter.off(event, listener);
};

Doctor.prototype.emit = function (event, data) {
    this.emitter.emit(event, data);
};

Doctor.prototype.notifyDrop = function (data) {
    this.emit('now.unhealthy', data);
};

Doctor.prototype.notifyRestore = function (data) {
    this.emit('now.healthy', data);
};


module.exports = Doctor;