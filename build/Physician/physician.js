'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Promise = require('bluebird');
var Abstract = require('../Abstract/abstract.js');

/**
 * Service standart API
 */

var Doctor = (function (_Abstract) {
    function Doctor() {
        _classCallCheck(this, Doctor);

        _get(Object.getPrototypeOf(Doctor.prototype), 'constructor', this).call(this, {
            event_group: 'doctor'
        });
        this.inspectors_array = [];
    }

    _inherits(Doctor, _Abstract);

    _createClass(Doctor, [{
        key: 'init',
        value: function init(config) {
            if (!config.hasOwnProperty('inspectors')) {
                config.inspectors = '*';
                //@TODO: and some actions to include whole dir
            }
            this.config = config;

            return this.emitter ? Promise.resolve(true) : Promise.reject('U should set channels before');
        }
    }, {
        key: 'start',
        value: function start() {
            this.paused = false;

            var inspectors_names = this.config.inspectors;
            var len = inspectors_names.length;

            var emitter_functions = {
                restore: this.notifyRestore.bind(this),
                drop: this.notifyDrop.bind(this),
                register: this.notifyRegister.bind(this)
            };

            for (var i = 0; i < len; i += 1) {
                var inspector_params = inspectors_names[i];

                var name = inspector_params.name;
                var params = inspector_params.params;

                var Inspector_Model = require('./inspectors/' + name + '.js');
                var inspector = new Inspector_Model(params, emitter_functions);
                inspector.start();
                this.inspectors_array.push(inspector);
            }

            return this;
        }
    }, {
        key: 'pause',
        value: function pause() {
            this.pause = true;
            for (var i = 0; i < this.inspectors_array.length; i += 1) {
                this.inspectors_array[i].stop();
            }

            return this;
        }
    }, {
        key: 'resume',
        value: function resume() {
            this.pause = false;
            for (var i = 0; i < this.inspectors_array.length; i += 1) {
                this.inspectors_array[i].start();
            }

            return this;
        }
    }, {
        key: 'notifyDrop',

        /**
         * Doctor's own API
         */

        /**
         * Emits drop event to chanels
         * @param   {Object}  data Inspector's data
         * @returns {Boolean} false if Doctor is paused
         */
        value: function notifyDrop(data) {
            if (this.paused) return false;
            this.emit(this.event_names.unhealthy, data);
        }
    }, {
        key: 'notifyRestore',

        /**
         * Emits restore events
         * @param   {Object}  data Inspector's event data
         * @returns {Boolean} false if Doctor is paused
         */
        value: function notifyRestore(data) {
            if (this.paused) return false;
            this.emit(this.event_names.healthy, data);
        }
    }, {
        key: 'notifyRegister',

        /**
         * Emits Inspector registe event
         * @param   {Object}  data Inspector's event data
         * @returns {Boolean}  false if Doctor is paused
         */
        value: function notifyRegister(data) {
            if (this.paused) return false;
            this.emit(this.event_names.register, data);
        }
    }, {
        key: 'on',

        /**
         * Some syntax sugar for testing and local usage
         */

        value: function on(event, listener) {
            if (!this.emitter) {
                throw new Error('Emitter not defined');
            }
            this.emitter.on(event, listener);
        }
    }, {
        key: 'emit',
        value: function emit(event, data) {
            if (!this.emitter) {
                throw new Error('Emitter not defined');
            }
            this.emitter.emit(event, data);
        }
    }]);

    return Doctor;
})(Abstract);

;

module.exports = Doctor;