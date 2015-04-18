'use strict'

var Abstract = require('./abstract.js');
var utils = require('util');

var IsonlineInspector = function (params, start, stop) {
    if (!params.hasOwnProperty('ip_range')) {
        throw new Error('ip_range param required');
        return;
    }
    this.ip_range = params.ip_range;


}

utils.inherits(PingInspector, Abstract);

module.exports = IsonlineInspector;