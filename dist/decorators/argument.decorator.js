'use strict';

require('reflect-metadata');

/**
 * @pixielity/ts-console v1.0.0
 * 
 * Advanced console toolkit for Node.js applications
 * 
 * @license MIT
 * @copyright 2025 Your Name <your.email@example.com>
 */

var ARGUMENT_METADATA_KEY = Symbol("argument");
function Argument(options) {
  return (target, propertyKey) => {
    let name = options.name;
    if (!options.required) {
      name = `[${name}]`;
    } else {
      name = `<${name}>`;
    }
    if (options.isArray) {
      name = `${name}...`;
    }
    const metadata = {
      name,
      description: options.description || "",
      defaultValue: options.defaultValue,
      propertyKey
    };
    const existingMetadata = Reflect.getMetadata(ARGUMENT_METADATA_KEY, target.constructor) || [];
    existingMetadata.push(metadata);
    Reflect.defineMetadata(ARGUMENT_METADATA_KEY, existingMetadata, target.constructor);
  };
}

exports.ARGUMENT_METADATA_KEY = ARGUMENT_METADATA_KEY;
exports.Argument = Argument;
//# sourceMappingURL=argument.decorator.js.map
//# sourceMappingURL=argument.decorator.js.map