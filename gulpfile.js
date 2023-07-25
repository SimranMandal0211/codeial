// To see this in public folder ---> write gulp css or gulp js or gulp in terminal

const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const rename = require('gulp-rename');
const crypto = require('crypto');

// Function to generate a random string of the specified length
function generateRandomString(length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

// Task to minify CSS and add random string to filenames
gulp.task('css', function () {
  console.log('minifying css...');

  // Minify the CSS files
  return gulp.src('./assets/**/*.css')
    .pipe(cleanCSS())
    .pipe(rename(function (path) {
      // Append the random string to the file name
      path.basename += '-' + generateRandomString(8); // Generating a random string of 8 characters
    }))
    .pipe(gulp.dest('./public/assets/css'));
});

// Task to minify JS and add random string to filenames
gulp.task('js', function () {
  console.log('minifying js...');

  // Minify the JS files
  return gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rename(function (path) {
      // Append the random string to the file name
      path.basename += '-' + generateRandomString(8); // Generating a random string of 8 characters
    }))
    .pipe(gulp.dest('./public/assets/js'));
});

// Define the default task (optional)
gulp.task('default', gulp.parallel('css', 'js'));

