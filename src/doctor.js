'use strict'
var EventEmitter2 = require('eventemitter2');

var Doctor = function (config) {
    this.emitter = new EventEmitter2({
        wildcard: true,
        newListener: false,
        maxListeners: 10
    });
    this.inspectors_array = [];

    if (config.hasOwnProperty('inspectors')) {
        config.inspectors = '*';
        //and some actions to include whole dir
    }

    var inspectors_names = config.inspectors;
    var self = this;

    inspectors_names.forEach(function (inspector_options) {
        var name = inspector_options.name;
        var params = inspector_options.params;
        var Inspector_Model = require('./inspectors/' + name + '.js');
        var inspector = new Inspector_Model(params, self.notifyRestore, self.notifyDrop);
        inspector.start();
        self.inspectors_array.push(inspector);
    });

};

Doctor.prototype.notifyDrop = function (data) {
    this.emit('now.healthy', data);
};

Doctor.prototype.notifyRestore = function (data) {
    this.emit('now.unhealthy', data);
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

module.exports = Doctor;