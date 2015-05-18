'use strict'

var Abstract = require('../Abstract/abstract.js');
var Promise = require('bluebird');

/*utility function*/
var modules = {};

var getPermission = function (module_name) {
    //coz cashing is slightly faster
    if (modules.hasOwnProperty(module_name)) {
        return modules[module_name];
    }

    modules[module_name] = require('./permissions/' + module_name + '.js')
    return modules[module_name];
}

/*--------------------*/

/**
 * Internal service for Auth service, but emits events on Q
 */
class PermissionList extends Abstract {
    constructor() {
        super({
            event_group: 'doctor'
        });
        this.permissions = {};
        this.doctor_events = this.getEvents('doctor');
    }
    init() {
            if (!this.emitter) return Promise.reject('U should set channels before');

            this.emitter.on(this.doctor_events.unhealthy, (data) => this.drop(data));
            this.emitter.on(this.doctor_events.healthy, (data) => this.restore(data));
            this.emitter.on(this.doctor_events.register, (data) => this.addPermision(data));

            return Promise.resolve(true);
        }
        /**
         * Own API starts here
         */
    addPermision(data) {
        var name = data.permission;
        var permission_module = name + '-permission';
        var p = {};

        if (!this.permissions.hasOwnProperty(name)) {
            var PModel = getPermission(permission_module);
            this.permissions[name] = p = new PModel(data);
            return true;
        }

        p = this.permissions[name];
        p.add(data);
        return true;

    }
    restore(data) {
        var name = data.permission;
        var changed = this.getPermission(name).restore(data);

        if (changed) {
            this.emitter.emit(this.event_names.restored, {
                wat: 'god bless u, its restored'
            });
        }
    }
    drop(data) {
        var name = data.permission;
        var changed = this.getPermission(name).drop(data);

        if (changed) {
            this.emitter.emit(this.event_names.dropped, {
                wat: 'yeap, its dropped'
            });
        }
    }
    getPermission(name) {
        return this.permissions[name];
    }
    exists(name) {
        return typeof this.getPermission(name) !== "undefined";
    }
    isDropped(name, params) {

        var permission = this.getPermission(name);

        return permission ? permission.isDropped(params) : false;
    }
}


module.exports = PermissionList;