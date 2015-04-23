'use strict'

var util = require('util');
var _ = require('lodash');

/**
 * Abstract permision, just for lulz
 * @param {Object} params permision specific params
 */
var IpPermission = function (params) {
    params = util.isArray(params) ? params : [params];
    this.ip_list = {};

    var len = params.length;

    for (var i = 0; i < len; i += 1) {
        if (!params[i].hasOwnProperty('ip')) throw new Error('Ip feild required');

        this.ip_list[params[i].ip] = {
            dropped_by: []
        };
    }

}

/**
 * drop the permision
 * @param   {Object}  params key params
 * @returns {Boolean} true means permission currently dropped, false - permission was dropped before
 */
IpPermission.prototype.drop = function (params) {
    var ip = params.ip;
    var name = params.inspector;
    var is_dropped = null;

    if (!this.ip_list.hasOwnProperty(ip)) throw new Error('Possibly unregistered inspector');
    var dropped_by = this.ip_list[ip].dropped_by;
    is_dropped = !dropped_by.length;

    if (dropped_by.indexOf(name) === -1) {
        dropped_by.push(name);
    }

    return is_dropped;
};

/**
 * try to restore the permision
 * @param   {Object}  params key params
 * @returns {Boolean} true if restored, false if still dropped
 */
IpPermission.prototype.restore = function (params) {
    var is_restored = null;
    var ip = params.ip;
    var name = params.inspector;

    if (!this.ip_list.hasOwnProperty(ip)) throw new Error('Possibly unregistered inspector');

    var dropped_by = this.ip_list[ip].dropped_by;

    if (dropped_by.length === 0) {
        return false;
    }

    this.ip_list[ip].dropped_by = _.without(dropped_by, name);

    is_restored = this.ip_list[ip].dropped_by.length === 0;

    return is_restored;
};

/**
 * add IP adress
 * @param {Object} params ip adress and may be some other fields
 */
IpPermission.prototype.add = function (params) {
    if (!params.hasOwnProperty('ip')) throw new Error('Ip feild required');
    var ip = params.ip;

    this.ip_list[ip] = {
        dropped_by: []
    };
};

IpPermission.prototype.isDropped = function (ip) {
    if (!this.ip_list.hasOwnProperty(ip)) return 'error';
    return !this.ip_list[ip].dropped_by.length;
};

module.exports = Permision;