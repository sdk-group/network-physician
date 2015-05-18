'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Abstract = require('../Abstract/abstract.js');
var Promise = require('bluebird');

/*utility function*/
var modules = {};

var getPermission = function getPermission(module_name) {
    //coz cashing is slightly faster
    if (modules.hasOwnProperty(module_name)) {
        return modules[module_name];
    }

    modules[module_name] = require('./permissions/' + module_name + '.js');
    return modules[module_name];
};

/*--------------------*/

/**
 * Internal service for Auth service, but emits events on Q
 */

var PermissionList = (function (_Abstract) {
    function PermissionList() {
        _classCallCheck(this, PermissionList);

        _get(Object.getPrototypeOf(PermissionList.prototype), 'constructor', this).call(this, {
            event_group: 'doctor'
        });
        this.permissions = {};
        this.doctor_events = this.getEvents('doctor');
    }

    _inherits(PermissionList, _Abstract);

    _createClass(PermissionList, [{
        key: 'init',
        value: function init() {
            var _this = this;

            if (!this.emitter) return Promise.reject('U should set channels before');

            this.emitter.on(this.doctor_events.unhealthy, function (data) {
                return _this.drop(data);
            });
            this.emitter.on(this.doctor_events.healthy, function (data) {
                return _this.restore(data);
            });
            this.emitter.on(this.doctor_events.register, function (data) {
                return _this.addPermision(data);
            });

            return Promise.resolve(true);
        }
    }, {
        key: 'addPermision',

        /**
         * Own API starts here
         */
        value: function addPermision(data) {
            var name = data.permission;
            var permission_module = name + '-permission';
            var p = {};

            if (!this.permissions.hasOwnProperty(name)) {
                var PModel = getPermission(permission_module);
                this.permissions[name] = p = new PModel(data);
                return true;
            }

            p = this.permissions[name];
            p.add(data);
            return true;
        }
    }, {
        key: 'restore',
        value: function restore(data) {
            var name = data.permission;
            var changed = this.getPermission(name).restore(data);

            if (changed) {
                this.emitter.emit(this.event_names.restored, {
                    wat: 'god bless u, its restored'
                });
            }
        }
    }, {
        key: 'drop',
        value: function drop(data) {
            var name = data.permission;
            var changed = this.getPermission(name).drop(data);

            if (changed) {
                this.emitter.emit(this.event_names.dropped, {
                    wat: 'yeap, its dropped'
                });
            }
        }
    }, {
        key: 'getPermission',
        value: function getPermission(name) {
            return this.permissions[name];
        }
    }, {
        key: 'exists',
        value: function exists(name) {
            return typeof this.getPermission(name) !== 'undefined';
        }
    }, {
        key: 'isDropped',
        value: function isDropped(name, params) {

            var permission = this.getPermission(name);

            return permission ? permission.isDropped(params) : false;
        }
    }]);

    return PermissionList;
})(Abstract);

module.exports = PermissionList;