var Doctor = require('./doctor.js');
var iconfig = require('./inspectors-config.json');

var doctor = new Doctor(iconfig);

doctor.on('now.unhealthy', function (data) {
    console.log('unhealthy:', data);
});

doctor.on('now.healthy', function (data) {
    console.log('healthy:', data);
});