import { IInput } from '@pixielity/ts-types';

/**
 * Implementation of the IInput interface
 *
 * Parses command line arguments and provides access to them.
 */
declare class Input implements IInput {
    /**
     * The command name
     * @private
     */
    private commandName?;
    /**
     * Map of argument names to values
     * @private
     */
    private args;
    /**
     * Map of option names to values
     * @private
     */
    private opts;
    /**
     * Creates a new Input instance
     *
     * @param {string[]} argv - The command line arguments
     */
    constructor(argv: string[]);
    /**
     * Gets the command name from the input
     *
     * @returns {string | undefined} The command name or undefined if not provided
     */
    getCommandName(): string | undefined;
    /**
     * Gets an argument value by name
     *
     * @param {string} name - The name of the argument
     * @returns {string | undefined} The argument value or undefined if not provided
     */
    getArgument(name: string): string | undefined;
    /**
     * Gets all arguments
     *
     * @returns {Record<string, string>} Map of argument names to values
     */
    getArguments(): Record<string, string>;
    /**
     * Gets an option value by name
     *
     * @param {string} name - The name of the option
     * @returns {string | boolean | undefined} The option value or undefined if not provided
     */
    getOption(name: string): string | boolean | undefined;
    /**
     * Gets all options
     *
     * @returns {Record<string, string | boolean>} Map of option names to values
     */
    getOptions(): Record<string, string | boolean>;
    /**
     * Checks if an option is set
     *
     * @param {string} name - The name of the option
     * @returns {boolean} True if the option is set, false otherwise
     */
    hasOption(name: string): boolean;
    /**
     * Parses the command line arguments
     *
     * @param {string[]} argv - The command line arguments
     * @private
     */
    private parse;
}

export { Input };
