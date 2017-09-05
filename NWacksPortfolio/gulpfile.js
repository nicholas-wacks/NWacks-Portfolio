/// <binding BeforeBuild='sass' />
var gulp = require("gulp");
var sass = require("gulp-sass");
var paths = {
   webroot: "./wwwroot/"
};
paths.scss = paths.webroot + "css/**/*.scss";
gulp.task('sass', function () {
   gulp.src(paths.scss)
     .pipe(sass())
     .pipe(gulp.dest(paths.webroot + "css"));
});
gulp.task('watch-sass', function () {
   gulp.watch(paths.scss, ['sass']);
});