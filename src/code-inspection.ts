import { CodeInspectionReport } from './types';

define((require, exports, module) => {

  const CodeInspection = brackets.getModule('language/CodeInspection');
  const LanguageManager = brackets.getModule('language/LanguageManager');
  const ProjectManager = brackets.getModule('project/ProjectManager');
  const PackageJson = JSON.parse(require('text!../package.json'));
  const EXTENSION_NAME = PackageJson.name;
  const EXTENSION_UNIQUE_NAME = 'zaggino.' + EXTENSION_NAME;
  const nodeDomain = require('./node-domain');
  const log = require('./log');
  const LINTER_NAME = 'Flow';

  function handleScanFile(text, fullPath) {
    throw new Error(LINTER_NAME + ' sync code inspection is not available, use async for ' + fullPath);
  }

  function handleScanFileAsync(text, fullPath): JQueryPromise<CodeInspectionReport> {
    const deferred = $.Deferred();
    const projectRoot = ProjectManager.getProjectRoot().fullPath;
    nodeDomain.exec('scanFileWithFlow', projectRoot, fullPath)
      .then((report: CodeInspectionReport) => {

        // set gutter marks using brackets-inspection-gutters module
        const w = window as any;
        if (w.bracketsInspectionGutters) {
          w.bracketsInspectionGutters.set(
            EXTENSION_UNIQUE_NAME, fullPath, report, true
          );
        } else {
          log.error(`No bracketsInspectionGutters found on window, gutters disabled.`);
        }

        deferred.resolve(report);
      }, (err) => {
        deferred.reject(err);
      });
    return deferred.promise();
  }

  module.exports = () => {
    ['js', 'jsx'].forEach((extension) => {
      const language = LanguageManager.getLanguageForExtension(extension);
      if (language) {
        CodeInspection.register(language.getId(), {
          name: LINTER_NAME,
          scanFile: handleScanFile,
          scanFileAsync: handleScanFileAsync
        });
      }
    });
  };

});
