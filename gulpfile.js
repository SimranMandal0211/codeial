// To see this in public folder ---> write gulp css or gulp js or gulp in terminal

const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const rename = require('gulp-rename');
const crypto = require('crypto');
const fs = require('fs');

// Function to generate a random string of the specified length
function generateRandomString(length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

// Empty object to store the manifest data
const manifestData = {};

gulp.task('css', function () {
  console.log('minifying css...');

  return gulp.src('./assets/**/*.css')
    .pipe(cleanCSS())
    .pipe(rename(function (path) {
      // Append the random string to the file name
      path.basename += '-' + generateRandomString(8); // Generating a random string of 8 characters
      const revisedFileName = `css/${path.basename}${path.extname}`;

      // const randomString = generateRandomString(8);
      // const revisedFileName = `css/${path.basename}-${randomString}${path.extname}`;

      // Store the filename mapping in the manifestData object
      manifestData[`css/${path.basename}${path.extname}`] = revisedFileName;
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
      const revisedFileName = `js/${path.basename}${path.extname}`;

      // const randomString = generateRandomString(8);
      // const revisedFileName = `css/${path.basename}-${randomString}${path.extname}`;

      // Store the filename mapping in the manifestData object
      manifestData[`js/${path.basename}${path.extname}`] = revisedFileName;
    }))
    .pipe(gulp.dest('./public/assets/js'));
});


gulp.task('images', function(done){
  console.log('compressing images...');
  gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
  .pipe(imagemin())
  .pipe(rev())
  .pipe(gulp.dest('./public/assets'))
  .pipe(rev.manifest({
      cwd: 'public',
      merge: true
  }))
  .pipe(gulp.dest('./public/assets'));
  done();
});


// Task to create the manifest.json file
gulp.task('create-manifest', function (done) {
  console.log('Creating manifest.json...');
  // Convert the manifestData object to a JSON string
  const manifestJson = JSON.stringify(manifestData, null, 2);
  // Write the JSON string to manifest.json
  fs.writeFile('./public/assets/manifest.json', manifestJson, 'utf8', function (err) {
    if (err) {
      console.error('Error writing manifest.json:', err);
    } else {
      console.log('manifest.json created successfully!');
    }
    done();
  });
});


// Export the 'create-manifest' task so that it can be run from the command line using 'gulp create-manifest'
exports['create-manifest'] = gulp.series('css', 'js', 'create-manifest');


