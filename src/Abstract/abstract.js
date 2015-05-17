'use strict'

var Promise = require('bluebird');

/*utility function*/
var getEvents = require('../const/events.js');
/*--------------------*/

/**
 * Abstract service
 */
var AbstrasctService = function () {
    /*
    Should be described before in superclass
    this.event_group 
    */
    this.paused = true;
    this.event_names = this.event_group ? getEvents(this.event_group) : {};
    this.queues_required = {
        "event-queue": true,
        "task-queue": false
    };
}


AbstrasctService.prototype.setChanels = function (options) {
    if (!options.hasOwnProperty('queue')) {

        if (this.queues_required['event-queue'] && this.queues_required['task-queue']) {
            throw new Error('Complex queue required');
        }

        if (this.queues_required['event-queue'] && !options.hasOwnProperty('event-queue')) {
            throw new Error('Event queue or complex queue required');
        }

        if (this.queues_required['task-queue'] && !options.hasOwnProperty('task-queue')) {
            throw new Error('Task queue or complex queue required');
        }

    }

    //@TODO: this should be much better. If EQ and TQ specified they should be combined in complex emitter

    this.emitter = options.queue || options['event-queue'] || options['task-queue'];

    return this;
}

AbstrasctService.prototype.init = function (config) {
    this.config = config || {};

    if (!this.emitter && (this.queues_required['event-queue'] || this.queues_required['task-queue'])) {
        return Promise.reject('U should set channels before');
    }

    return Promise.resolve(true);
};

AbstrasctService.prototype.start = function () {
    //@TODO: What should it do in current context?
    this.paused = false;

    return this;
};

AbstrasctService.prototype.pause = function () {
    //@TODO: What should it do in current context?
    this.paused = true;

    return this;
};

AbstrasctService.prototype.resume = function () {
    //@TODO: What should it do in current context?
    this.paused = false;

    return this;
};

module.exports = AbstrasctService;