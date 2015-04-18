var ping = require('./inspectors/ping.js');
var config = require('./config.json');
console.log(config);
var p = new ping({
    ip_range: 2
});