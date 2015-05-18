'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Abstract = require('../Abstract/abstract.js');
var util = require('util');
var Promise = require('bluebird');
var PermissionList = require('./permission-list.js');

var Auth = (function (_Abstract) {
    function Auth() {
        _classCallCheck(this, Auth);

        _get(Object.getPrototypeOf(Auth.prototype), 'constructor', this).call(this, {
            event_group: 'doctor'
        });

        this.queues_required = {
            'event-queue': true,
            'task-queue': true
        };
        this.list = new PermissionList();
    }

    _inherits(Auth, _Abstract);

    _createClass(Auth, [{
        key: 'setChanels',
        value: function setChanels(options) {
            _get(Object.getPrototypeOf(Auth.prototype), 'setChanels', this).call(this, options);

            this.list.setChanels(options);

            return this;
        }
    }, {
        key: 'init',
        value: function init(config) {
            this.config = config || {};
            if (!this.emitter) return Promise.reject('U should set channels before');

            this.list.init();

            return Promise.resolve(true);
        }
    }, {
        key: 'start',
        value: function start() {
            this.paused = false;
            this.list.start();

            return this;
        }
    }, {
        key: 'pause',
        value: function pause() {
            //@TODO: Dunno what should they do when paused or resumed
            this.paused = true;
            this.list.pause();

            return this;
        }
    }, {
        key: 'resume',
        value: function resume() {
            //@TODO: Dunno what should they do when paused or resumed
            this.paused = false;
            this.list.resume();

            return this;
        }
    }, {
        key: 'check',

        /**
         * own API
         */
        value: function check(asked_permissions) {
            asked_permissions = util.isArray(asked_permissions) ? asked_permissions : [asked_permissions];

            if (asked_permissions.length === 0) {}
            var valid = true;
            var confirmation_list = {
                valid: true,
                details: []
            };

            var len = asked_permissions.length;
            for (var i = 0; i < len; i += 1) {
                var name = asked_permissions[i].permission;
                var key = asked_permissions[i].key;
                var info = {
                    name: name,
                    valid: true
                };

                if (!this.list.exists(name)) {
                    valid = false;
                    info.reason = 'not-exists';
                    info.valid = false;
                } else if (this.list.isDropped(name, key)) {
                    valid = false;
                    info.reason = 'dropped';
                    info.valid = false;
                }

                confirmation_list.details.push(info);
            }
            confirmation_list.valid = valid;
            return confirmation_list;
        }
    }]);

    return Auth;
})(Abstract);

module.exports = Auth;