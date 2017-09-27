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
const paa = require('gulp-puppeteer-accessibility-audit');

gulp.task('audit', function () {
  return gulp.src('./**/*.html')
    .pipe(paa())
    .pipe(paa.reporter());
});
```

## Reporters

There are 3 reporters available for use. 

* `reporter` - Reports at the end all passes and fails, does not trigger a failure
* `failAfterError` - Reports at the end but only prints failures and will emit an error 
* `failOnError` - Will emit an error on the first failure

## Config

All config data passed into `paa` will be passed directly to [Puppeteer Accessibility Audit](https://github.com/xeroxinteractive/puppeteer-accessibility-audit#config)

* `puppeteerConfig` is passed to: [puppeteer.launch](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions)
* `viewport` is passed to: [page.setViewport](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagesetviewportviewport)
* `auditScopeSelector` is used to target the audit and is passed to a `document.querySelector`. 

For example

```javascript
const paa = require('gulp-puppeteer-accessibility-audit');

gulp.task('audit', function () {
  return gulp.src('./**/*.html')
    .pipe(paa({
      puppeteerConfig: {
        timeout: 5000,
        headless: false
      },
      viewport: {
        width: 1920,
        height: 1080
      },
      auditScopeSelector: "#content"
    }))
    .pipe(paa.reporter());
});
```

## Credits

Lots of copy and pasting of [gulp-a11y](https://github.com/mpezzi/gulp-a11y/) by [Michael Pezzi](https://github.com/mpezzi)