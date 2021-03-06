'use strict';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

const gutil = require('gulp-util');

const paa = require('../');
const fixture = new gutil.File({
  base: __dirname + '/',
  cwd: __dirname,
  path: __dirname + '/fixture.html'
});

let stream;

beforeEach(async () => {
  stream = null;
  
  stream = paa();
});

test('should return a report', (done) => {

  stream.on('data', function (file) {
    expect(file).toHaveProperty("paa");
    expect(file.paa).toHaveProperty("audit");
    expect(file.paa).toHaveProperty("report");
  });

  stream.on('end', function () {
    done();
  });

  stream.write(fixture);
  stream.end();

});

test('should format a report', (done) => {

  let report = paa.reporter(function (output) {
    expect(output).not.toBeNull();
  });

  stream.on('end', function () {
    done();
  });

  stream.write(fixture);
  stream.pipe(report);
  stream.end();
});

test('Should audit the file and throw  at the first error', (done) => {

  let fail = paa.failOnError();
  let thrown = false;

  stream.on('data', function (file) {
    expect(file).toHaveProperty("paa");
    expect(file.paa).toHaveProperty("audit");
    expect(file.paa).toHaveProperty("report");

    expect(file.paa.audit).toMatchSnapshot();
    expect(file.paa.report).toMatchSnapshot();
  });

  fail.on('error', function (error) {
    thrown = true;
    expect(error).not.toBeNull();
    done();
  });

  fail.on('end', function () {
    expect(thrown).toBe(true);
    done();
  });

  stream.write(fixture);
  stream.pipe(fail);
  stream.end();
});

// Skipping this test as it causes a failure in puppeteer.
test.skip('Should audit the file and throw at the end', (done) => {
  
    let fail = paa.failAfterError();
    let thrown = false;
  
    stream.on('data', function (file) {
      expect(file).toHaveProperty("paa");
      expect(file.paa).toHaveProperty("audit");
      expect(file.paa).toHaveProperty("report");
  
      expect(file.paa.audit).toMatchSnapshot();
      expect(file.paa.report).toMatchSnapshot();
    });
  
    fail.on('error', function (error) {
      thrown = true;
      expect(error).not.toBeNull();
      done();
    });
  
    fail.on('end', function () {
      expect(thrown).toBe(true);
      done();
    });
  
    stream.write(fixture);
    stream.pipe(fail);
    stream.end();
  });