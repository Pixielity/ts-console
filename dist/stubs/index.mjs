import * as fs from 'fs';
import * as path from 'path';
import { injectable } from 'inversify';

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
var StubGenerator = class {
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
      const stubPath = path.join(this.stubsDir, `${stubName}.stub`);
      if (!fs.existsSync(stubPath)) {
        throw new Error(`Stub template "${stubName}" not found.`);
      }
      let content = fs.readFileSync(stubPath, "utf8");
      for (const [placeholder, value] of Object.entries(replacements)) {
        content = content.replace(new RegExp(`\\{\\{${placeholder}\\}\\}`, "g"), value);
      }
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(outputPath, content);
      return true;
    } catch (error) {
      console.error(`Error generating file: ${error instanceof Error ? error.message : String(error)}`);
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
      return fs.readdirSync(this.stubsDir).filter((file) => file.endsWith(".stub")).map((file) => file.replace(".stub", ""));
    } catch (error) {
      console.error(`Error getting available stubs: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }
};
StubGenerator = __decorateClass([
  injectable()
], StubGenerator);

export { StubGenerator };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map