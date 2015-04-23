var iconfig = require('./inspectors-config.json');

var Doctor = require('./doctor.js');
var PermissionList = require('./permission-list.js');

var doctor = new Doctor();

var permissions = new PermissionList();

doctor.on('now.unhealthy', function (data) {
    console.log('unhealthy:', data);
    //   permissions.drop(data);
});

doctor.on('now.healthy', function (data) {
    console.log('healthy:', data);
    //   permissions.restore(data);
});

doctor.on('inspector.register', function (data) {
    permissions.addPermision(data);
});

/*should do this after all listeners are subscribed*/

doctor.init(iconfig);