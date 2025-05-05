'use strict';

var inversify = require('inversify');

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
exports.CommandRegistry = class CommandRegistry {
  constructor() {
    /**
     * Map of command names to command instances
     * @private
     */
    this.commands = /* @__PURE__ */ new Map();
  }
  /**
   * Adds a command to the registry
   *
   * @param {ICommand} command - The command to add
   * @throws {Error} If a command with the same name already exists
   */
  add(command) {
    const name = command.getName();
    if (this.commands.has(name)) {
      throw new Error(`Command "${name}" already exists.`);
    }
    this.commands.set(name, command);
  }
  /**
   * Gets a command by name
   *
   * @param {string} name - The name of the command
   * @returns {ICommand | undefined} The command or undefined if not found
   */
  get(name) {
    return this.commands.get(name);
  }
  /**
   * Gets all registered commands
   *
   * @returns {ICommand[]} Array of all registered commands
   */
  getAll() {
    return Array.from(this.commands.values());
  }
  /**
   * Checks if a command exists
   *
   * @param {string} name - The name of the command
   * @returns {boolean} True if the command exists, false otherwise
   */
  has(name) {
    return this.commands.has(name);
  }
  /**
   * Removes a command from the registry
   *
   * @param {string} name - The name of the command
   * @returns {boolean} True if the command was removed, false otherwise
   */
  remove(name) {
    return this.commands.delete(name);
  }
  /**
   * Clears all commands from the registry
   */
  clear() {
    this.commands.clear();
  }
};
exports.CommandRegistry = __decorateClass([
  inversify.injectable()
], exports.CommandRegistry);
//# sourceMappingURL=command-registry.js.map
//# sourceMappingURL=command-registry.js.map