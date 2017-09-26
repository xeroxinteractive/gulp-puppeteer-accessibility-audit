'use strict';

const utils         = require('./utils');
const map           = require('map-stream');
const gutil         = require('gulp-util');
const logSymbols    = require('log-symbols');
const indentString  = require('indent-string');
const paa           = require('puppeteer-accessibility-audit');

const PLUGIN_NAME = 'gulp-puppeteer-accessibility-audit';
const PluginError  = gutil.PluginError;

var plugin = function (opts) {

  return map(function (file, cb) {
    paa(file.path, opts || {}, function (err, audit, report) {

      if (err) {
        cb(new PluginError(PLUGIN_NAME, { name: PLUGIN_NAME, message: err.message }), file);
      }

      file.paa = {
        audit: audit,
        report: report
      };

      cb(null, file);

    });
  });

};

plugin.failOnError = function () {

  return map(function (file, cb) {

    var report = utils.formatReport(file, file.paa, true),
        error  = null;

    if (report) {
      error = new PluginError(PLUGIN_NAME, {
        name: PLUGIN_NAME,
        fileName: file.path,
        message: report
      });
    }

    cb(error, file);

  });

};

plugin.failAfterError = function () {

  var errors = [];

  return map(function (file, cb) {

    var report = utils.formatReport(file, file.paa, true);

    if (report) {
      errors.push(report);
    }

    cb(null, file);

  }).once('end', function () {

    if (errors.length) {
      var error = new PluginError(PLUGIN_NAME, {
        name: PLUGIN_NAME,
        message: errors.join('\n')
      });

      this.emit('error', error);
    }

  });

};

plugin.reporter = function (writable) {

  var results = [];

  writable = utils.resolveWritable(writable);

  return map(function (file, cb) {

    var report = utils.formatReport(file, file.paa);

    if (report) {
      results.push(report);
    }

    cb(null, file);

  }).once('end', function () {

    if (results.length) {
      utils.writeReport(results.join(''), writable);
    }

    results = [];

  });

};

module.exports = plugin;