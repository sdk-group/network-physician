'use strict'

var PermissionList = function () {
    this.permissions = {};
}

PermissionList.prototype.addPermision = function (data) {
    var name = data.permission;
    var permission_module = name + '-permission';
    if (this.permissions.hasOwnProperty(name)) {}
    console.log(permission_module);
};

PermissionList.prototype.restore = function (data) {
    var changed = this.getPermission(data).restore();
    if (changed) {
        //do stuff
    }
};

PermissionList.prototype.drop = function (data) {
    var changed = this.getPermission(data).drop();
    if (changed) {
        //do stuff
    }
};

PermissionList.prototype.getPermission = function (data) {
    //permission or error
    var permission = {};
    return permission;
};

module.exports = PermissionList;