'use strict';

var inversify = require('inversify');
require('reflect-metadata');

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
var INJECTABLE_METADATA_KEY = Symbol("injectable");
function Injectable() {
  return (target) => {
    const paramTypes = Reflect.getMetadata("design:paramtypes", target) || [];
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, paramTypes, target);
  };
}

exports.INJECTABLE_METADATA_KEY = INJECTABLE_METADATA_KEY;
exports.Injectable = Injectable;
exports.container = container;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map