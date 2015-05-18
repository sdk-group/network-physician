'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Promise = require('bluebird');

/*utility function*/
var _getEvents = require('../const/events.js');
/*--------------------*/

/**
 * Abstract service
 */

var AbstrasctService = (function () {
    function AbstrasctService(_ref) {
        var event_group = _ref.event_group;

        _classCallCheck(this, AbstrasctService);

        this.paused = true;
        this.event_names = event_group ? this.getEvents(event_group) : {};
        this.queues_required = {
            'event-queue': true,
            'task-queue': false
        };
    }

    _createClass(AbstrasctService, [{
        key: 'getEvents',
        value: function getEvents(event_group) {
            return _getEvents(event_group);
        }
    }, {
        key: 'setChanels',
        value: function setChanels(options) {
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
    }, {
        key: 'init',
        value: function init(config) {
            this.config = config || {};

            if (!this.emitter && (this.queues_required['event-queue'] || this.queues_required['task-queue'])) {
                return Promise.reject('U should set channels before');
            }

            return Promise.resolve(true);
        }
    }, {
        key: 'start',
        value: function start() {
            //@TODO: What should it do in current context?
            this.paused = false;

            return this;
        }
    }, {
        key: 'pause',
        value: function pause() {
            //@TODO: What should it do in current context?
            this.paused = true;

            return this;
        }
    }, {
        key: 'resume',
        value: function resume() {
            //@TODO: What should it do in current context?
            this.paused = false;

            return this;
        }
    }]);

    return AbstrasctService;
})();

module.exports = AbstrasctService;