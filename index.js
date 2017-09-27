'use strict';

const utils         = require('./utils');
const map           = require('map-stream');
const gutil         = require('gulp-util');
const logSymbols    = require('log-symbols');
const indentString  = require('indent-string');
const paa           = require('puppeteer-accessibility-audit');
const through       = require('through2');

const PLUGIN_NAME = 'gulp-puppeteer-accessibility-audit';
const PluginError  = gutil.PluginError;

var plugin = (opts) => {
  opts = Object.assign({}, opts);

  let launched = false;

  return through.obj(
    async (file, enc, cb) => {
      try {
        if (!launched) {
          await paa.launch(opts);
          launched = true;
        }

        let paaResult = await paa.audit(file.path, opts);

        file.paa = paaResult;
        
        cb(null, file);
      }
      catch (err) {
        cb(new PluginError(PLUGIN_NAME, { name: PLUGIN_NAME, message: err.message }), file);
      }
    },
    async (cb) => {
      await paa.destroy();
      
      cb();
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