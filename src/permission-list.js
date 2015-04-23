'use strict'
var modules = {};
var getPermission = function (module_name) {
    //coz cashing is slightly faster
    if (modules.hasOwnProperty(module_name)) {
        return modules[module_name];
    }

    modules[module_name] = require('./permissions/' + module_name + '.js')
    return modules[module_name];
}

var PermissionList = function () {
    this.permissions = {};
}

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
        console.log(data, 'restored');
    }
};

PermissionList.prototype.drop = function (data) {
    var name = data.permission;
    var changed = this.getPermission(name).drop(data);
    if (changed) {
        console.log(data, 'droped');
    }
};

PermissionList.prototype.getPermission = function (name) {
    //permission or error
    return this.permissions[name];
};

module.exports = PermissionList;