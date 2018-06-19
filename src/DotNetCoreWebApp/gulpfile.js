/// <binding Clean='clean' />
"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    tsc = require("gulp-typescript");

var webroot = "./wwwroot/";
var nodeModulesDirectory = 'node_modules/';


var paths = {
    js: webroot + "js/**/*.js",
    minJs: webroot + "js/**/*.min.js",
    css: webroot + "css/**/*.css",
    minCss: webroot + "css/**/*.min.css",
    concatJsDest: webroot + "js/site.min.js",
    concatCssDest: webroot + "css/site.min.css"

};

gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("min:js", function () {
    return gulp.src([paths.js, "!" + paths.minJs], { base: "." })
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:css", function () {
    return gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("ng2", function () {
    gulp.src([
        "node_modules/es6-shim/*.*",
        "node_modules/angular2/bundles/*.*",
        "node_modules/systemjs/dist/*.*",
        "node_modules/ng2-pagination/dist/*.*"

    ]).pipe(gulp.dest(webroot + "lib/ng2"));
    gulp.src([
        "node_modules/rxjs/**/*"
    ]).pipe(gulp.dest(webroot + "lib/ng2/rxjs"))


    gulp.src([
        nodeModulesDirectory + "es6-shim/es6-shim.min.js",
        nodeModulesDirectory + "systemjs/dist/system-polyfills.js",
        nodeModulesDirectory + "angular2/bundles/angular2-polyfills.min.js",
        nodeModulesDirectory + "systemjs/dist/system.js",

        // nodeModulesDirectory + "rxjs/bundles/Rx.umd.min.js",
        nodeModulesDirectory + "angular2/bundles/angular2.min.js",
        nodeModulesDirectory + "angular2/bundles/http.min.js",
        nodeModulesDirectory + "angular2/bundles/router.min.js"
    ]).pipe(uglify())
        .pipe(concat(webroot + "js/angular.app.min.js"))
        .pipe(gulp.dest("."));



});

gulp.task("tsTranspile", function () {
    gulp.src(['node_modules/angular2/typings/browser.d.ts',
        webroot + "app/**/*.ts"])
        .pipe(tsc({
            noImplicitAny: false,
            noEmitOnError: true,
            removeComments: false,
            sourceMap: true,
            target: "es5",
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            suppressImplicitAnyIndexErrors: true
        }))
        .pipe(gulp.dest(webroot + "app"));
});

gulp.task("min", ["min:js", "min:css"]);

gulp.task('default', ['ng2', 'tsTranspile', 'min']);
