var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var uglify = require('gulp-uglify-es').default;
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var webserver = require('gulp-webserver');
var del = require('del');
var watchify = require("watchify");
var gutil = require("gulp-util");
var tslint = require("gulp-tslint");

var paths = {
    pages: ['./src/*.html'],
    mainTs: ['./src/Main.ts'],
    outscripts: ['dist']
};

var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: paths.mainTs,
    cache: {},
    packageCache: {}
}).plugin(tsify))

watchedBrowserify.on("update", bundle)
watchedBrowserify.on("log", gutil.log);

function bundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.outscripts[0]));
}

gulp.task('watch', bundle);

gulp.task('lint', function () {
    gulp.src(paths.mainTs[0])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

gulp.task('copy-html', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    return del(paths.outscripts + '**/*');
});

gulp.task('build', ['clean', 'copy-html', 'lint'], function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: paths.mainTs
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.outscripts[0]));
});

gulp.task('start-server', function() {
    gulp.src(paths.outscripts[0])
      .pipe(webserver({
        port: 8080,
        fallback: 'index.html',
        livereload: true,
        directoryListing: false
    }));
});

gulp.task('stop-server', function() {
    gulp.src('app').pipe(webserver()).emit('kill');
});
