var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var watch = require('gulp-watch');

require("harmonize")();

gulp.task("default", function () {
    return gulp.src("src-es6/**/*.js")
        .pipe(babel({
            blacklist: ['bluebirdCoroutines', 'regenerator']
        }))
        .pipe(gulp.dest("build")).on('end', function () {
            require('./build/example.js');
            setTimeout(function () {
                console.log('timeout');
                process.exit()
            }, 30000);
        });
});

gulp.task('es6', function () {
    return gulp.src("src-es6/**/*.js")
        .pipe(babel({
            blacklist: ['bluebirdCoroutines', 'regenerator']
        }))
        .pipe(gulp.dest("build"));
});



gulp.task("sm", function () {
    return gulp.src("src-es6/**/*.js")
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write("./maps"))
        .pipe(gulp.dest("build"));
});