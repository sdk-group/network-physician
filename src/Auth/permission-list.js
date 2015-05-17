'use strict'

var Abstract = require('../Abstract/abstract.js');
var util = require('util');

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
var PermissionList = function () {
    this.event_group = 'permission';
    PermissionList.super_.apply(this);
    this.permissions = {};
}

util.inherits(PermissionList, Abstract);

/**
 * Own API starts here
 */

PermissionList.prototype.addPermision = function (data) {
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

};

PermissionList.prototype.restore = function (data) {
    var name = data.permission;
    var changed = this.getPermission(name).restore(data);

    if (changed) {
        this.emitter.emit(this.event_names.dropped, {
            wat: 'god bless u, its restored'
        });
    }
};

PermissionList.prototype.drop = function (data) {
    var name = data.permission;
    var changed = this.getPermission(name).drop(data);

    if (changed) {
        this.emitter.emit(this.event_names.dropped, {
            wat: 'yeap, its dropped'
        });
    }
};

PermissionList.prototype.getPermission = function (name) {
    return this.permissions[name];
};

PermissionList.prototype.exists = function (name) {
    return typeof this.getPermission(name) !== "undefined";
};

PermissionList.prototype.isDropped = function (name, params) {

    var permission = this.getPermission(name);

    return permission ? permission.isDropped(params) : false;
};



module.exports = PermissionList;