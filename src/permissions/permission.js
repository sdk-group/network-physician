'use strict'


/**
 * Abstract permision, just for lulz
 * @param {Object} params permision specific params
 */
var Permission = function (params) {
    this.init_params = init_params;
}

/**
 * drop the permision
 * @param   {Object}  params key params
 * @returns {Boolean} true means permission currently dropped, false - permission was dropped before
 */
Permission.prototype.drop = function (params) {
    //return true || false = dropped || still_droped
};

/**
 * try to restore the permision
 * @param   {Object}  params key params
 * @returns {Boolean} true if restored, false if still dropped
 */
Permission.prototype.restore = function (params) {
    //return true || false;
};

Permission.prototype.add = function (params) {

};

module.exports = Permision;