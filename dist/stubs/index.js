'use strict';

var fs = require('fs');
var path = require('path');
var inversify = require('inversify');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespace(fs);
var path__namespace = /*#__PURE__*/_interopNamespace(path);

/**
 * @pixielity/ts-console v1.0.0
 * 
 * Advanced console toolkit for Node.js applications
 * 
 * @license MIT
 * @copyright 2025 Your Name <your.email@example.com>
 */

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
exports.StubGenerator = class StubGenerator {
  /**
   * Creates a new StubGenerator instance
   *
   * @param {string} stubsDir - The directory containing the stub templates
   */
  constructor(stubsDir) {
    this.stubsDir = stubsDir;
  }
  /**
   * Generates a file from a stub template
   *
   * @param {string} stubName - The name of the stub template
   * @param {string} outputPath - The path where the generated file will be saved
   * @param {Record<string, string>} replacements - Map of placeholders to their replacements
   * @returns {boolean} True if the file was generated successfully, false otherwise
   */
  generate(stubName, outputPath, replacements) {
    try {
      const stubPath = path__namespace.join(this.stubsDir, `${stubName}.stub`);
      if (!fs__namespace.existsSync(stubPath)) {
        throw new Error(`Stub template "${stubName}" not found.`);
      }
      let content = fs__namespace.readFileSync(stubPath, "utf8");
      for (const [placeholder, value] of Object.entries(replacements)) {
        content = content.replace(new RegExp(`\\{\\{${placeholder}\\}\\}`, "g"), value);
      }
      const dir = path__namespace.dirname(outputPath);
      if (!fs__namespace.existsSync(dir)) {
        fs__namespace.mkdirSync(dir, { recursive: true });
      }
      fs__namespace.writeFileSync(outputPath, content);
      return true;
    } catch (error) {
      console.error(
        `Error generating file: ${error instanceof Error ? error.message : String(error)}`
      );
      return false;
    }
  }
  /**
   * Gets the list of available stub templates
   *
   * @returns {string[]} Array of stub template names
   */
  getAvailableStubs() {
    try {
      return fs__namespace.readdirSync(this.stubsDir).filter((file) => file.endsWith(".stub")).map((file) => file.replace(".stub", ""));
    } catch (error) {
      console.error(
        `Error getting available stubs: ${error instanceof Error ? error.message : String(error)}`
      );
      return [];
    }
  }
};
exports.StubGenerator = __decorateClass([
  inversify.injectable()
], exports.StubGenerator);
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map