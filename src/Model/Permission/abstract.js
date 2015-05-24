'use strict'

/**
 * Abstract permision, just for lulz
 * @param {Object} params permision specific params
 */
class Permission_Abstract {
    constructor() {}
    static keyToString(key_obj) {
        throw new Error('abstract method call');
    }
    static makeKey(key_data) {
        return key_data;
    }
    static getName() {
        throw new Error('abstract method call');
    }
    static dropMessage(params) {
        return params;
    }
    static restoreMessage(params) {
        return params;
    }
    requestMessage(params) {
        var message = {};
        return message;
    }
}

module.exports = Permission_Abstract;