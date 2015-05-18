'use strict'

var Abstract = require('../Abstract/abstract.js');
var util = require('util');
var Promise = require('bluebird');
var PermissionList = require('./permission-list.js');

var Auth = function () {
    this.event_group = 'doctor';
    Auth.super_.apply(this);

    this.queues_required = {
        "event-queue": true,
        "task-queue": true
    };
    this.list = new PermissionList();
}

util.inherits(Auth, Abstract);

Auth.prototype.setChanels = function (options) {
    Auth.super_.prototype.setChanels.call(this, options);

    this.list.setChanels(options);

    return this;
};

Auth.prototype.init = function (config) {
    this.config = config || {};
    if (!this.emitter) return Promise.reject('U should set channels before');

    this.list.init();

    return Promise.resolve(true);
};

Auth.prototype.start = function () {
    this.paused = false;
    this.list.start();

    return this;
};

Auth.prototype.pause = function () {
    //@TODO: Dunno what should they do when paused or resumed
    this.paused = true;
    this.list.pause();

    return this;
};

Auth.prototype.resume = function () {
    //@TODO: Dunno what should they do when paused or resumed
    this.paused = false;
    this.list.resume();

    return this;
};

/**
 * own API
 */

Auth.prototype.check = function (asked_permissions) {
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

        if (!this.list.exists(name)) {
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
};

module.exports = Auth;