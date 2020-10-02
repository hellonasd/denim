const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourceMap = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const autoprefix = require('autoprefixer');
const server = require('browser-sync');
const del = require('del');
const gulpCsso = require('gulp-csso');
const gulpPlumber = require('gulp-plumber');
const gulpPostCss = require('gulp-postcss');
const gulpSass = require('gulp-sass');

gulpSass.compiler = require('node-sass');

gulp.task('css', function () {
    return gulp.src('src/scss/style.scss')
        .pipe(plumber())
        .pipe(sourceMap.init())
        .pipe(gulpSass())
        .pipe(gulpPostCss([
            autoprefix()
        ]))
        .pipe(gulpCsso())
        .pipe(rename('style.min.css'))
        .pipe(sourceMap.write('.'))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('html',function () {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist'))
});


gulp.task('refresh', function (done) {
    server.reload()
    done()
})

gulp.task('server',function () {
    server.init({
       server : 'dist/',
        notify : false,
        open : true,
        cors : true,
        ui : false,
    })
    gulp.watch('src/scss/**/*.scss', gulp.series('css','refresh'))
    gulp.watch('src/*html',gulp.series('html', 'refresh'))

});
gulp.task('copy',function () {
    return gulp.src([
        'src/font/**/*.{woff,woff2}',
        'src/img/**'
    ],{
        base: 'src'
    })
        .pipe(gulp.dest('dist'))
});

gulp.task('clean',function () {
    return del('dist')
});

gulp.task('build', gulp.series('clean', 'copy','html', 'css'));
gulp.task('start', gulp.series('build', 'server'));