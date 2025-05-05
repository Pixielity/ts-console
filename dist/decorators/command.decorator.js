'use strict';

require('reflect-metadata');
var inversify = require('inversify');
var tsTypes = require('@pixielity/ts-types');

/**
 * @pixielity/ts-console v1.0.0
 * 
 * Advanced console toolkit for Node.js applications
 * 
 * @license MIT
 * @copyright 2025 Your Name <your.email@example.com>
 */

var container = new inversify.Container({
  defaultScope: "Singleton"
});

// src/decorators/command.decorator.ts
var COMMAND_METADATA_KEY = Symbol("command");
function Command(options) {
  return (target) => {
    var _a, _b;
    const commandOptions = {
      ...options,
      hidden: (_a = options.hidden) != null ? _a : false,
      injectable: (_b = options.injectable) != null ? _b : true,
      description: options.description || "",
      shortcuts: options.shortcuts || []
    };
    Reflect.defineMetadata(COMMAND_METADATA_KEY, commandOptions, target);
    if (commandOptions.injectable) {
      inversify.injectable()(target);
      try {
        container.bind(tsTypes.ICommand.$).to(target).inSingletonScope();
      } catch (error) {
      }
    }
  };
}

exports.COMMAND_METADATA_KEY = COMMAND_METADATA_KEY;
exports.Command = Command;
//# sourceMappingURL=command.decorator.js.map
//# sourceMappingURL=command.decorator.js.map