'use strict'
var EventEmitter2 = require('eventemitter2').EventEmitter2;

var Doctor = function () {
    this.emitter = new EventEmitter2({
        wildcard: false,
        newListener: false,
        maxListeners: 10
    });
    this.inspectors_array = [];
};

Doctor.prototype.notifyDrop = function (data) {
    this.emit('now.unhealthy', data);
};

Doctor.prototype.notifyRestore = function (data) {
    this.emit('now.healthy', data);
};

Doctor.prototype.notifyRegister = function (data) {
    this.emit('inspector.register', data)
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

Doctor.prototype.init = function (config) {

    if (!config.hasOwnProperty('inspectors')) {
        config.inspectors = '*';
        //and some actions to include whole dir
    }

    var inspectors_names = config.inspectors;
    var len = inspectors_names.length;

    var emitter_functions = {
        restore: this.notifyRestore.bind(this),
        drop: this.notifyDrop.bind(this),
        register: this.notifyRegister.bind(this)
    };

    for (var i = 0; i < len; i += 1) {
        var inspector_params = inspectors_names[i];

        var name = inspector_params.name;
        var params = inspector_params.params;

        var Inspector_Model = require('./inspectors/' + name + '.js');
        var inspector = new Inspector_Model(params, emitter_functions);
        inspector.start();
        this.inspectors_array.push(inspector);
    }
};

module.exports = Doctor;