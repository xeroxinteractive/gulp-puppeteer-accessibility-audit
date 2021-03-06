'use strict';

const gutil        = require('gulp-util');
const logSymbols   = require('log-symbols');
const indentString = require('indent-string');

var Utils = {

  /**
   * Resolve writable.
   */
  resolveWritable: function (writable) {

    if (!writable) {
      writable = gutil.log;
    }
    else if (typeof writable === 'function') {
      writable = writable.bind(writable);
    }

    return writable;

  },

  /**
   * Format report.
   */
  formatReport: function (file, onlyFailures = false) {

    let output   = '';

    if (file && file.paa) {
      let audits   = file.paa.audit || [];
      let passes   = '';
      let failures = '';

      audits.forEach(function (audit) {
        if (audit.result === 'PASS' && !onlyFailures) {
          passes += logSymbols.success + ' ' + audit.heading + '\n';
        }
        if (audit.result === 'FAIL') {
          failures += logSymbols.error + ' ' + audit.heading + '\n';
          failures += audit.elements + '\n\n';
        }
      });

      if (passes || failures) {
        output += '\n\n';
        output += indentString(gutil.colors.yellow(file.path), 2);
        output += '\n\n';
        output += indentString(failures + passes, 2);
      }
    }

    return output;

  },

  /**
   * Write results to writable / output.
   */
  writeReport: function (report, writable) {

    if (writable && report) {
      writable(report);
    }

  }

};

module.exports = Utils;