import 'reflect-metadata'

/**
 * Metadata key for injectable
 */
export const INJECTABLE_METADATA_KEY = Symbol('injectable')

/**
 * Injectable decorator
 *
 * Marks a class as injectable
 *
 * @returns {ClassDecorator} The class decorator
 */
export function Injectable(): ClassDecorator {
  return (target: Function) => {
    // Get the design:paramtypes metadata, which contains the types of the constructor parameters
    const paramTypes = Reflect.getMetadata('design:paramtypes', target) || []

    // Store the parameter types as dependencies
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, paramTypes, target)
  }
}
