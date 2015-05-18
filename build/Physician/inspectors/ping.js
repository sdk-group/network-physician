'use strict';

var Promise = require('bluebird');
var Pinger = require('./ping-single.js');
var _ = require('lodash');

var PingInspector = function PingInspector(params, emitters) {
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
        self.pingers.push(new Pinger(options, emitters));
    }).value();
};

PingInspector.prototype.stop = function () {
    _(this.pingers).forEach(function (pinger) {
        return pinger.stop();
    }).value();
};

PingInspector.prototype.start = function () {
    _(this.pingers).forEach(function (pinger) {
        return pinger.run();
    }).value();
};

module.exports = PingInspector;