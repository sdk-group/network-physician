var util = require('util');

var a = function () {
    console.log('a');
    this.q = 10;
}

a.prototype.mthd = function (x) {
    this.q += x;
};

var b = function () {
    console.log('b');
    console.log(b.super_.apply(this));
}

util.inherits(b, a);

b.prototype.mthd = function (x) {
    b.super_.prototype.mthd.call(this, x);
    console.log(this.q);
};

var q = new b();
q.mthd(11);