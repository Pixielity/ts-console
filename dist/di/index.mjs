import { Container } from 'inversify';
import 'reflect-metadata';

/**
 * @pixielity/ts-console v1.0.0
 * 
 * Advanced console toolkit for Node.js applications
 * 
 * @license MIT
 * @copyright 2025 Your Name <your.email@example.com>
 */

var container = new Container({
  defaultScope: "Singleton"
});
var INJECTABLE_METADATA_KEY = Symbol("injectable");
function Injectable() {
  return (target) => {
    const paramTypes = Reflect.getMetadata("design:paramtypes", target) || [];
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, paramTypes, target);
  };
}

export { INJECTABLE_METADATA_KEY, Injectable, container };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map