'use strict'

var Promise = require('bluebird');
var Pinger = require('./ping-single.js');
var _ = require('lodash');

class PingInspector {
    constructor(params, emitters) {
        var self = this;
        this.stop = false;

        if (!params.hasOwnProperty('ip')) {
            throw new Error('ip_range param required');
            return;
        }
        this.ip = params.ip;

        this.pingers = [];
        //bluebird generator there
        _(this.ip).forEach((ip) => {
            var options = {
                interval: params.interval,
                less_then: params.less_then,
                key_data: ip
            };
            self.pingers.push(new Pinger(options, emitters));
        }).value();

    }


    stop() {
        _(this.pingers).forEach(pinger => pinger.stop()).value();
    }

    start() {
        _(this.pingers).forEach(pinger => pinger.run()).value();
    }
}

module.exports = PingInspector;