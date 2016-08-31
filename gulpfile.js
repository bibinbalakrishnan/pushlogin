var gulp=require('gulp'),nodemon=require('gulp-nodemon');


gulp.task('serve', function () {
  nodemon({
    script: 'server.js'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  })
})


gulp.task('default', ['serve']);