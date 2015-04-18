'use strict'

var Abstract = require('./abstract.js');
var utils = require('util');
var Promise = require('bluebird');
var http = require("http");

var PingInspector = function (params, start, stop) {
    if (!params.hasOwnProperty('ip_range')) {
        throw new Error('ip_range param required');
        return;
    }
    this.ip_range = params.ip_range;
    //bluebird generator there
    this.ping("192.168.42.74")
        .then(function (time) {
            console.log("Response time: %dms", time);
        })
        .catch(function (time) {
            console.log("rejected: %dms", time);
        });
}

utils.inherits(PingInspector, Abstract);

PingInspector.prototype.ping = function (url, port) {
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

module.exports = PingInspector;