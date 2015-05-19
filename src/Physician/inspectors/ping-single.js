'use strict'
var Abstract = require('./abstract.js');
var Promise = require('bluebird');
var http = require("http");
var utils = require('util');

var ping = function (url, port) {
    var promise = new Promise(function (resolve, reject) {
        var result;
        var options = {
            host: url,
            port: port || 80,
            path: '/'
        };
        var start = Date.now();
        var pingRequest = http.request(options, function () {
            result = Date.now() - start;
            resolve(result);
            pingRequest.abort();
        });
        pingRequest.on("error", function () {
            result = -1;
            reject(result);
            pingRequest.abort();
        });
        pingRequest.write("");
        pingRequest.end();
    });

    return promise;
};

var makeMessage = function (params) {
    return {
        key: {
            ip: params.ip
        },
        reason: params.reason
    };
}

var Single = function (params, emitters) {
    var interval = params.interval;
    var timeout = params.less_then;
    var selected_ip = params.ip;
    var self = this;

    this.stop = false;

    this.restore = emitters.restore;
    this.drop = emitters.drop;
    this.register = emitters.register;
    this.ping = Promise.coroutine(function* () {
        while (!self.stop) {
            yield Promise.delay(interval)
            yield ping(selected_ip)
                .timeout(timeout, 'timeout')
                .then(function (time) {
                    var message = makeMessage({
                        ip: selected_ip,
                        reason: 'online'
                    });
                    self.send('restore', message);
                })
                .catch(function (data) {
                    if (data.hasOwnProperty("message") && data.message === 'timeout') {
                        var message = makeMessage({
                            ip: selected_ip,
                            reason: 'low-latency'
                        });
                        self.send('drop', message);
                        return;
                    }
                    var message = makeMessage({
                        ip: selected_ip,
                        reason: 'ping-error'
                    });
                    self.send('drop', message);
                });
        }
    });

    this.send('register', {
        ip: selected_ip
    });
}

utils.inherits(Single, Abstract);

Single.prototype.permission_name = 'ip';

Single.prototype.inspector_name = 'ip/ping';

Single.prototype.run = function () {
    this.stop = false;
    this.ping();
};

Single.prototype.stop = function () {
    this.stop = true;
};

module.exports = Single;