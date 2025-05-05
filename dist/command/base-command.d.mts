import { ICommand, IInput, IOutput } from '@pixielity/ts-types';

/**
 * Abstract base class for console commands
 *
 * Provides common functionality for all commands.
 */
declare abstract class BaseCommand implements ICommand {
    /**
     * Success exit code (0)
     * @static
     */
    static readonly SUCCESS = 0;
    /**
     * Failure exit code (1)
     * @static
     */
    static readonly FAILURE = 1;
    /**
     * Invalid input exit code (2)
     * @static
     */
    static readonly INVALID = 2;
    /**
     * The name of the command
     * @protected
     */
    protected name: string;
    /**
     * The description of the command
     * @protected
     */
    protected description: string;
    /**
     * The input instance
     * @protected
     */
    protected input: IInput;
    /**
     * The output instance
     * @protected
     */
    protected output: IOutput;
    /**
     * Creates a new BaseCommand instance
     *
     * @param {string} [name] - The name of the command (optional)
     * @param {string} [description] - The description of the command (optional)
     */
    constructor(name?: string, description?: string);
    /**
     * Gets the name of the command
     *
     * @returns {string} The command name
     */
    getName(): string;
    /**
     * Gets the description of the command
     *
     * @returns {string} The command description
     */
    getDescription(): string;
    /**
     * Sets the input instance
     *
     * @param {IInput} input - The input instance
     */
    setInput(input: IInput): void;
    /**
     * Gets the input instance
     *
     * @returns {IInput} The input instance
     */
    getInput(): IInput;
    /**
     * Sets the output instance
     *
     * @param {IOutput} output - The output instance
     */
    setOutput(output: IOutput): void;
    /**
     * Gets the output instance
     *
     * @returns {IOutput} The output instance
     */
    getOutput(): IOutput;
    /**
     * Sets the command arguments
     *
     * @param {string[]} args - The command arguments
     */
    setArguments(args: string[]): void;
    /**
     * Sets the command options
     *
     * @param {Record<string, any>} options - The command options
     */
    setOptions(options: Record<string, any>): void;
    /**
     * Configures the command with options and arguments
     *
     * This method should be overridden by subclasses to define
     * command-specific options and arguments.
     */
    configure(): void;
    /**
     * Executes the command
     *
     * This method must be implemented by subclasses to provide
     * command-specific functionality.
     *
     * @returns {Promise<number | void>} The exit code or void
     */
    abstract execute(): Promise<number | void>;
    /**
     * Hook that runs before command execution
     *
     * @returns {Promise<boolean>} True if execution should continue, false to abort
     */
    beforeExecute(): Promise<boolean>;
    /**
     * Hook that runs after command execution
     *
     * @param {number | void} exitCode - The exit code from the command
     * @returns {Promise<void>}
     */
    afterExecute(exitCode: number | void): Promise<void>;
    /**
     * Writes a line to the output
     *
     * @param {string} message - The message to write
     */
    protected line(message?: string): void;
    /**
     * Writes an info message to the output
     *
     * @param {string} message - The message to write
     */
    protected info(message: string): void;
    /**
     * Writes a success message to the output
     *
     * @param {string} message - The message to write
     */
    protected success(message: string): void;
    /**
     * Writes an error message to the output
     *
     * @param {string} message - The message to write
     */
    protected error(message: string): void;
    /**
     * Writes a warning message to the output
     *
     * @param {string} message - The message to write
     */
    protected warning(message: string): void;
    /**
     * Writes a comment message to the output
     *
     * @param {string} message - The message to write
     */
    protected comment(message: string): void;
}

export { BaseCommand };
