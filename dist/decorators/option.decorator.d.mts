/**
 * Metadata key for options
 */
declare const OPTION_METADATA_KEY: unique symbol;
/**
 * Option options interface
 */
interface OptionOptions {
    /**
     * The flags for the option (e.g., "-n, --name")
     */
    flags: string;
    /**
     * The description of the option
     */
    description?: string;
    /**
     * The default value of the option
     */
    defaultValue?: any;
}
/**
 * Option decorator
 *
 * Defines a command option
 *
 * @param {OptionOptions} options - The option options
 * @returns {PropertyDecorator} The property decorator
 */
declare function Option(options: OptionOptions): PropertyDecorator;

export { OPTION_METADATA_KEY, Option, type OptionOptions };
