'use strict'

var PermissionList = function () {
    this.permisions = [];
}

PermissionList.prototype.addPermision = function (data) {

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

    return permission;
};

module.exports = PermissionList;