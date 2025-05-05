'use strict';

var path = require('path');
var glob = require('glob');
var inversify = require('inversify');
var tsTypes = require('@pixielity/ts-types');
require('reflect-metadata');

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
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var container = new inversify.Container({
  defaultScope: "Singleton"
});
var COMMAND_METADATA_KEY = Symbol("command");

// src/discovery/command-collector.ts
exports.CommandCollector = class CommandCollector {
  /**
   * Discovers commands in the specified directory
   *
   * @param {string} directory - The directory to scan for commands
   * @param {string} pattern - The glob pattern to match command files
   * @returns {Promise<ICommand[]>} The discovered commands
   */
  async discoverCommands(directory, pattern = "**/*-command.{ts,js}") {
    return exports.CommandCollector.discoverCommands(directory, pattern);
  }
  /**
   * Gets all commands that have been registered with the container
   *
   * @returns {ICommand[]} The registered commands
   */
  getRegisteredCommands() {
    return exports.CommandCollector.getRegisteredCommands();
  }
  /**
   * Gets command metadata for a command class
   *
   * @param {Function} commandClass - The command class
   * @returns {any} The command metadata
   */
  getCommandMetadata(commandClass) {
    return exports.CommandCollector.getCommandMetadata(commandClass);
  }
  /**
   * Discovers commands in the specified directory
   *
   * @param {string} directory - The directory to scan for commands
   * @param {string} pattern - The glob pattern to match command files
   * @returns {Promise<ICommand[]>} The discovered commands
   */
  static async discoverCommands(directory, pattern = "**/*-command.{ts,js}") {
    try {
      const absolutePath = path__namespace.isAbsolute(directory) ? directory : path__namespace.join(process.cwd(), directory);
      const files = await glob.glob(pattern, {
        cwd: absolutePath,
        absolute: true
      });
      for (const file of files) {
        try {
          __require(file);
        } catch (error) {
          console.error(`Error importing command file ${file}:`, error);
        }
      }
      return container.getAll(tsTypes.ICommand.$);
    } catch (error) {
      console.error("Error discovering commands:", error);
      return [];
    }
  }
  /**
   * Gets all commands that have been registered with the container
   *
   * @returns {ICommand[]} The registered commands
   */
  static getRegisteredCommands() {
    return container.getAll(tsTypes.ICommand.$);
  }
  /**
   * Gets command metadata for a command class
   *
   * @param {Function} commandClass - The command class
   * @returns {any} The command metadata
   */
  static getCommandMetadata(commandClass) {
    return Reflect.getMetadata(COMMAND_METADATA_KEY, commandClass);
  }
};
exports.CommandCollector = __decorateClass([
  inversify.injectable()
], exports.CommandCollector);
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map