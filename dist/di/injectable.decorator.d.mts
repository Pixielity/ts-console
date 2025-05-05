/**
 * Metadata key for injectable
 */
declare const INJECTABLE_METADATA_KEY: unique symbol;
/**
 * Injectable decorator
 *
 * Marks a class as injectable
 *
 * @returns {ClassDecorator} The class decorator
 */
declare function Injectable(): ClassDecorator;

export { INJECTABLE_METADATA_KEY, Injectable };
