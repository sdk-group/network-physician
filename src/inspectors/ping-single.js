'use strict'

var Promise = require('bluebird');
var http = require("http");

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

var Single = function (params, emitters) {
    var interval = params.interval;
    var timeout = params.less_then;
    var selected_ip = params.ip;
    var self = this;
    this.stop = false;

    var restore = emitters.restore;
    var drop = emitters.drop;
    var register = emitters.register;

    this.ping = Promise.coroutine(function* () {
        while (!self.stop) {

            yield Promise.delay(interval)
            yield ping(selected_ip).timeout(timeout, 'timeout')
                .then(function (time) {
                    //console.log("Response time: %dms", time);
                    var message = {
                        ip: selected_ip,
                        description: 'online',
                        type: 'ping.received',
                        time: time
                    };
                    restore(message);
                })
                .catch(function (data) {
                    if (data.hasOwnProperty("message") && data.message === 'timeout') {
                        //console.log("timeout");
                        var message = {
                            ip: selected_ip,
                            description: 'low latency',
                            type: 'ping.timeout',
                            limit: timeout
                        };
                        drop(message);
                        return;
                    }
                    //console.log('error');
                    var message = {
                        ip: selected_ip,
                        description: 'error happens',
                        type: 'ping.error'
                    };
                    drop(message);
                });
        }
    });

    register({
        permision: 'ping',
        params: {
            ip: selected_ip
        }
    });
}

Single.prototype.run = function () {
    this.stop = false;
    this.ping();
};

Single.prototype.stop = function () {
    this.stop = true;
};

module.exports = Single;