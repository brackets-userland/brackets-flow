define((require, exports, module) => {
  'use strict';

  const PackageJson = JSON.parse(require('text!../package.json'));
  const EXTENSION_NAME = PackageJson.name;
  // const EXTENSION_UNIQUE_NAME = 'zaggino.' + EXTENSION_NAME;

  function log(level, ...args) {
    return console[level].apply(console, ['[' + EXTENSION_NAME + ']'].concat(args));
  }

  exports.info = (...args) => {
    return log('log', ...args);
  };

  exports.error = (...args) => {
    return log('error', ...args);
  };

});
