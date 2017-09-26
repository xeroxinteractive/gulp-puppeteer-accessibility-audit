'use strict';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

const gutil = require('gulp-util');
const paa = require('../');

let stream, fixture;

beforeEach(async () => {
  fixture = new gutil.File({
    base: __dirname + '/',
    cwd: __dirname,
    path: __dirname + '/fixture.html'
  });

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

  var report = paa.reporter(function (output) {
    expect(output).not.toBeNull();
  });

  stream.on('end', function () {
    done();
  });

  stream.write(fixture);
  stream.pipe(report);
  stream.end();
});

test('should fail on error', (done) => {

  var fail = paa.failOnError();

  stream.on('data', function (file) {
    expect(file).toHaveProperty("paa");
    expect(file.paa).toHaveProperty("audit");
    expect(file.paa).toHaveProperty("report");
  });

  fail.on('error', function (error) {
    expect(error).not.toBeNull();
    done();
  });

  fail.on('end', function () {
    done(new Error('Stream completed without failure.'));
  });

  stream.write(fixture);
  stream.pipe(fail);
  stream.end();
});