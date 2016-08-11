'use strict';

import { scanFileWithFlow } from './flow';

const PackageJson = require('../../package.json');
const EXTENSION_NAME = PackageJson.name;
const EXTENSION_UNIQUE_NAME = 'zaggino.' + EXTENSION_NAME;
const domainName = EXTENSION_UNIQUE_NAME;
let domainManager = null;

exports.init = function (_domainManager) {
  domainManager = _domainManager;

  if (!domainManager.hasDomain(domainName)) {
    domainManager.registerDomain(domainName, { major: 0, minor: 1 });
  }

  domainManager.registerCommand(
    domainName,
    'scanFileWithFlow', // command name
    scanFileWithFlow, // handler function
    true, // is async
    'scanFileWithFlow', // description
    [
      { name: 'projectRoot', type: 'string' },
      { name: 'fullPath', type: 'string' }
    ], [
      { name: 'report', type: 'object' }
    ]
  );

};
