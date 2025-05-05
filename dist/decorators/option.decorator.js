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

var OPTION_METADATA_KEY = Symbol("option");
function Option(options) {
  return (target, propertyKey) => {
    const metadata = {
      flags: options.flags,
      description: options.description || "",
      defaultValue: options.defaultValue,
      propertyKey
    };
    const existingMetadata = Reflect.getMetadata(OPTION_METADATA_KEY, target.constructor) || [];
    existingMetadata.push(metadata);
    Reflect.defineMetadata(OPTION_METADATA_KEY, existingMetadata, target.constructor);
  };
}

exports.OPTION_METADATA_KEY = OPTION_METADATA_KEY;
exports.Option = Option;
//# sourceMappingURL=option.decorator.js.map
//# sourceMappingURL=option.decorator.js.map