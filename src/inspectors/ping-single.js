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

var Single = function (params, start, stop) {
    var interval = params.interval;
    var timeout = params.less_then;
    this.selected_ip = params.ip;
    var self = this;
    this.stop = false;
    this.ping = Promise.coroutine(function* () {
        while (!self.stop) {
            yield Promise.delay(interval)
            yield ping(self.selected_ip)
                .timeout(timeout, 'timeout')
                .then(function (time) {
                    //console.log("Response time: %dms", time);
                    var message = {
                        ip: self.selected_ip,
                        description: 'online',
                        type: 'ping.received',
                        time: time
                    };
                    start(message);
                })
                .catch(function (data) {
                    if (data.hasOwnProperty("message") && data.message === 'timeout') {
                        //console.log("timeout");
                        var message = {
                            ip: self.selected_ip,
                            description: 'low latency',
                            type: 'ping.timeout',
                            limit: timeout
                        };
                        stop(message);
                        return;
                    }
                    //console.log('error');
                    var message = {
                        ip: self.selected_ip,
                        description: 'error happens',
                        type: 'ping.error'
                    };
                    console.log(data);
                    stop(message);
                });
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