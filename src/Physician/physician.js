'use strict'
var Promise = require('bluebird');
var Abstract = require('../Abstract/abstract.js');
var util = require('util');


/**
 * Service standart API
 */
var Doctor = function () {
    this.inspectors_array = [];
    this.event_group = 'doctor';
    Doctor.super_.apply(this);
};

util.inherits(Doctor, Abstract);

Doctor.prototype.init = function (config) {
    if (!config.hasOwnProperty('inspectors')) {
        config.inspectors = '*';
        //@TODO: and some actions to include whole dir
    }
    this.config = config;

    return this.emitter ? Promise.resolve(true) : Promise.reject('U should set channels before');
}

Doctor.prototype.start = function () {

    this.paused = false;

    var inspectors_names = this.config.inspectors;
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

    return this;
};

Doctor.prototype.pause = function () {
    this.pause = true;
    for (var i = 0; i < this.inspectors_array.length; i += 1) {
        this.inspectors_array[i].stop();
    }

    return this;
};

Doctor.prototype.resume = function () {
    this.pause = false;
    for (var i = 0; i < this.inspectors_array.length; i += 1) {
        this.inspectors_array[i].start();
    }

    return this;
};

/**
 * Doctor's own API
 */

/**
 * Emits drop event to chanels
 * @param   {Object}  data Inspector's data
 * @returns {Boolean} false if Doctor is paused
 */
Doctor.prototype.notifyDrop = function (data) {
    if (this.paused) return false;
    this.emit(this.event_names.unhealthy, data);
};
/**
 * Emits restore events
 * @param   {Object}  data Inspector's event data
 * @returns {Boolean} false if Doctor is paused
 */
Doctor.prototype.notifyRestore = function (data) {
    if (this.paused) return false;
    this.emit(this.event_names.healthy, data);
};

/**
 * Emits Inspector registe event
 * @param   {Object}  data Inspector's event data
 * @returns {Boolean}  false if Doctor is paused
 */
Doctor.prototype.notifyRegister = function (data) {
    if (this.paused) return false;
    this.emit(this.event_names.register, data)
};

/**
 * Some syntax sugar for testing and local usage
 */

Doctor.prototype.on = function (event, listener) {
    if (!this.emitter) {
        throw new Error('Emitter not defined');
    }
    this.emitter.on(event, listener);
};

Doctor.prototype.emit = function (event, data) {
    if (!this.emitter) {
        throw new Error('Emitter not defined');
    }
    this.emitter.emit(event, data);
};



module.exports = Doctor;