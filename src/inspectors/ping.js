'use strict'

var Abstract = require('./abstract.js');
var utils = require('util');
var Promise = require('bluebird');
var Pinger = require('./ping-single.js');
var _ = require('lodash');

var PingInspector = function (params, start, stop) {
    var self = this;
    this.stop = false;

    if (!params.hasOwnProperty('ip')) {
        throw new Error('ip_range param required');
        return;
    }
    this.ip = params.ip;

    this.pingers = [];
    //bluebird generator there
    _(this.ip).forEach(function (ip) {
        var options = {
            interval: params.interval,
            less_then: params.less_then,
            ip: ip
        };
        self.pingers.push(new Pinger(options, start, stop));
    }).value();

}

utils.inherits(PingInspector, Abstract);

PingInspector.prototype.stop = function () {
    _(this.pingers).forEach(function (pinger) {
        pinger.stop();
    }).value();
};

PingInspector.prototype.start = function () {
    _(this.pingers).forEach(function (pinger) {
        pinger.run();
    }).value();
};
module.exports = PingInspector;