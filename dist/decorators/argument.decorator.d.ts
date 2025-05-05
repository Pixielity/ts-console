/**
 * Metadata key for arguments
 */
declare const ARGUMENT_METADATA_KEY: unique symbol;
/**
 * Argument options interface
 */
interface ArgumentOptions {
    /**
     * The name of the argument
     */
    name: string;
    /**
     * The description of the argument
     */
    description?: string;
    /**
     * The default value of the argument
     */
    defaultValue?: any;
    /**
     * Whether the argument is required
     */
    required?: boolean;
    /**
     * Whether the argument is an array (variadic)
     */
    isArray?: boolean;
}
/**
 * Argument decorator
 *
 * Defines a command argument
 *
 * @param {ArgumentOptions} options - The argument options
 * @returns {PropertyDecorator} The property decorator
 */
declare function Argument(options: ArgumentOptions): PropertyDecorator;

export { ARGUMENT_METADATA_KEY, Argument, type ArgumentOptions };
