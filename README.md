# Gulp Puppeteer Accessibility Audit

Gulp plugin for [Puppeteer Accessibility Audit](https://github.com/xeroxinteractive/puppeteer-accessibility-audit)


## Installation

```shell
npm install --save-dev gulp-puppeteer-accessibility-audit
```
or
```shell
yarn add --dev gulp-puppeteer-accessibility-audit
```

## Usage

```javascript
var paa = require('gulp-puppeteer-accessibility-audit');

gulp.task('audit', function () {
  return gulp.src('./**/*.html')
    .pipe(paa())
    .pipe(paa.reporter());
});
```

## Credits

Lots of copy and pasting of [gulp-a11y](https://github.com/mpezzi/gulp-a11y/) by [Michael Pezzi](https://github.com/mpezzi)