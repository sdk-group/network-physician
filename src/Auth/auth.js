'use strict'

var Abstract = require('../Abstract/abstract.js');
var util = require('util');
var Promise = require('bluebird');
var PermissionList = require('../PermissionHolder/permission-holder.js');

class Auth extends Abstract {
    constructor() {
        super({
            event_group: 'doctor'
        });

        this.queues_required = {
            "event-queue": true,
            "task-queue": true
        };
        this.list = new PermissionList();
    }
    setChannels(options) {
        super.setChannels(options);

        this.list.setChannels(options);

        return this;
    }

    init(config) {
        this.config = config || {};
        if (!this.emitter) return Promise.reject('U should set channels before');

        return this.list.init();
    }

    start() {
        this.paused = false;
        this.list.start();

        return this;
    }

    pause() {
        //@TODO: Dunno what should they do when paused or resumed
        this.paused = true;
        this.list.pause();

        return this;
    }
    resume() {
            //@TODO: Dunno what should they do when paused or resumed
            this.paused = false;
            this.list.resume();

            return this;
        }
        /**
         * own API
         */
    check(asked_permissions) {
        asked_permissions = util.isArray(asked_permissions) ? asked_permissions : [asked_permissions];

        if (asked_permissions.length === 0) {}
        var valid = true;
        var confirmation_list = {
            valid: true,
            details: []
        };

        var len = asked_permissions.length;
        for (var i = 0; i < len; i += 1) {
            var name = asked_permissions[i].permission;
            var key = asked_permissions[i].key;
            var info = {
                name: name,
                valid: true
            };

            if (!this.list.exists(name, key)) {
                valid = false;
                info.reason = 'not-exists';
                info.valid = false;
            } else
            if (this.list.isDropped(name, key)) {
                valid = false;
                info.reason = 'dropped';
                info.valid = false;
            }

            confirmation_list.details.push(info);
        }
        confirmation_list.valid = valid;
        return confirmation_list;
    }
}

module.exports = Auth;