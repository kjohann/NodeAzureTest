var gulp = require('gulp');
var rename = require('gulp-rename');

var browserify = require('browserify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');	

var less = require('gulp-less');
var prefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');

var karma = require('karma').server;

gulp.task('browserify', function() {
	return browserify({
			debug: true,
			entries: ['client/js/index.js'],
			insertGlobals: true
		})
		.bundle()
		.pipe(source('bundle.min.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(uglify())
			.on('error', gutil.log)
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('public/js'));
});

//Less
gulp.task('styles', function() {
  	return gulp.src('client/less/main.less')
		.pipe(less())
    	.pipe(prefix({ cascade: true }))
		.pipe(rename('main.css'))
    	.pipe(gulp.dest('build'));
});

gulp.task('minifyCss', ['styles'], function() {
  	return gulp.src('build/main.css')
    	.pipe(minifyCSS())
		.pipe(rename('main.min.css'))
    	.pipe(gulp.dest('public/css'));
});

gulp.task('test', function(done) {
	karma.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, function() {
		done();
	});
});

gulp.task('build', ['browserify', 'minifyCss']);

gulp.task('watch', function() {
	gulp.watch('client/js**/*.js', ['browserify', 'test']);
	gulp.watch('test/**/*.js', ['test']);
	gulp.watch('client/less/**/*.less', ['minifyCss'])
});