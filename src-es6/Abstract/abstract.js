'use strict'

var Promise = require('bluebird');

/*utility function*/
var getEvents = require('../const/events.js');
/*--------------------*/

/**
 * Abstract service
 */
class AbstrasctService {
    constructor({
        event_group: event_group
    }) {
        this.paused = true;
        this.event_names = event_group ? this.getEvents(event_group) : {};
        this.queues_required = {
            "event-queue": true,
            "task-queue": false
        };
    }
    getEvents(event_group) {
        return getEvents(event_group);
    }

    setChanels(options) {
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

    init(config) {
        this.config = config || {};

        if (!this.emitter && (this.queues_required['event-queue'] || this.queues_required['task-queue'])) {
            return Promise.reject('U should set channels before');
        }

        return Promise.resolve(true);
    }

    start() {
        //@TODO: What should it do in current context?
        this.paused = false;

        return this;
    }

    pause() {
        //@TODO: What should it do in current context?
        this.paused = true;

        return this;
    }

    resume() {
        //@TODO: What should it do in current context?
        this.paused = false;

        return this;
    }
}

module.exports = AbstrasctService;