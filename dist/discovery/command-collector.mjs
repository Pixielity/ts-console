import * as path from 'path';
import { glob } from 'glob';
import { Container, injectable } from 'inversify';
import { ICommand } from '@pixielity/ts-types';
import 'reflect-metadata';

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
var container = new Container({
  defaultScope: "Singleton"
});
var COMMAND_METADATA_KEY = Symbol("command");

// src/discovery/command-collector.ts
var CommandCollector = class {
  /**
   * Discovers commands in the specified directory
   *
   * @param {string} directory - The directory to scan for commands
   * @param {string} pattern - The glob pattern to match command files
   * @returns {Promise<ICommand[]>} The discovered commands
   */
  async discoverCommands(directory, pattern = "**/*-command.{ts,js}") {
    return CommandCollector.discoverCommands(directory, pattern);
  }
  /**
   * Gets all commands that have been registered with the container
   *
   * @returns {ICommand[]} The registered commands
   */
  getRegisteredCommands() {
    return CommandCollector.getRegisteredCommands();
  }
  /**
   * Gets command metadata for a command class
   *
   * @param {Function} commandClass - The command class
   * @returns {any} The command metadata
   */
  getCommandMetadata(commandClass) {
    return CommandCollector.getCommandMetadata(commandClass);
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
      const absolutePath = path.isAbsolute(directory) ? directory : path.join(process.cwd(), directory);
      const files = await glob(pattern, {
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
      return container.getAll(ICommand.$);
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
    return container.getAll(ICommand.$);
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
CommandCollector = __decorateClass([
  injectable()
], CommandCollector);

export { CommandCollector };
//# sourceMappingURL=command-collector.mjs.map
//# sourceMappingURL=command-collector.mjs.map