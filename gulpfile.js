var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
let cleanCSS = require('gulp-clean-css');
var ExifImage = require('exif').ExifImage;
const execFile = require('child_process').execFile;
const hugo = require('hugo-bin');


gulp.task('styles', function() {
    gulp.src('source/sass/**/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['> 0.1% in GB'],
            cascade: false
        }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./static/css/'));
});


gulp.task('compile', function() {
    execFile(hugo, (err, stdout) => {
  		console.log(stdout);
	});
});


gulp.task('gallery', function() {
	try {
    new ExifImage({ image : 'static/imgs/gallery/bg.jpg' }, function (error, exifData) {
        if (error)
            console.log('Error: ' + error.message);
        else
            console.log(exifData); // Do something with your data! 
    });
	} catch (error) {
	    console.log('Error: ' + error.message);
	}
});

gulp.task('default',function() {
	execFile(hugo, ['server'], (err, stdout) => {
  		console.log(stdout);
	});
    gulp.watch('source/sass/**/*.sass',['styles']);
    gulp.watch('static/imgs/gallery/*.jpg',['gallery']);
});