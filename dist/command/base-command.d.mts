import { ICommand, IInput, IOutput } from '@pixielity/ts-types';

/**
 * Abstract base class for console commands.
 *
 * Provides a consistent structure and common functionality for defining and executing
 * commands in the console. Supports Laravel/Symfony-inspired argument and option handling.
 */
declare abstract class BaseCommand implements ICommand {
    /**
     * Exit code for successful execution.
     */
    static readonly SUCCESS = 0;
    /**
     * Exit code indicating a general failure.
     */
    static readonly FAILURE = 1;
    /**
     * Exit code for invalid user input.
     */
    static readonly INVALID = 2;
    /**
     * Name of the command.
     * Defined in the constructor or through the `@Command` decorator metadata.
     */
    protected name: string;
    /**
     * Description of the command.
     * Shown in help output and can be set via constructor or metadata.
     */
    protected description: string;
    /**
     * Input instance for handling command-line arguments and options.
     */
    protected input: IInput;
    /**
     * Output instance for writing messages to the terminal.
     */
    protected output: IOutput;
    /**
     * Creates a new instance of the BaseCommand.
     *
     * @param name - The name of the command (optional if using decorator)
     * @param description - The description of the command
     * @throws Will throw if name is missing and no decorator metadata is found.
     */
    constructor(name?: string, description?: string);
    /**
     * Returns the name of the command.
     *
     * @returns The command name.
     */
    getName(): string;
    /**
     * Returns the description of the command.
     *
     * @returns The command description.
     */
    getDescription(): string;
    /**
     * Sets the input instance used by this command.
     *
     * @param input - The input instance.
     */
    setInput(input: IInput): void;
    /**
     * Retrieves the current input instance.
     *
     * @returns The input instance.
     */
    getInput(): IInput;
    /**
     * Sets the output instance used by this command.
     *
     * @param output - The output instance.
     */
    setOutput(output: IOutput): void;
    /**
     * Retrieves the current output instance.
     *
     * @returns The output instance.
     */
    getOutput(): IOutput;
    /**
     * Sets multiple arguments for the command.
     *
     * @param args - Positional arguments as an array.
     */
    setArguments(args: string[]): void;
    /**
     * Sets a single named argument.
     *
     * @param key - The argument name.
     * @param value - The argument value.
     */
    setArgument(key: string, value: any): void;
    /**
     * Retrieves all arguments as a key-value object.
     *
     * @returns Object containing all arguments.
     */
    getArguments(): Record<string, any>;
    /**
     * Retrieves a single argument by name.
     *
     * @param key - The argument name.
     * @returns The value of the argument or undefined if not found.
     */
    getArgument(key: string): any;
    /**
     * Sets multiple options for the command.
     *
     * @param options - Object of option keys and values.
     */
    setOptions(options: Record<string, any>): void;
    /**
     * Sets a single named option.
     *
     * @param key - The option name.
     * @param value - The option value.
     */
    setOption(key: string, value: any): void;
    /**
     * Retrieves all options as a key-value object.
     *
     * @returns Object containing all options.
     */
    getOptions(): Record<string, any>;
    /**
     * Retrieves a single option by name.
     *
     * @param key - The option name.
     * @returns The value of the option or undefined if not found.
     */
    getOption(key: string): any;
    /**
     * Configures arguments and options.
     *
     * Should be overridden in the subclass to define expected inputs.
     */
    configure(): void;
    /**
     * Abstract method that executes the command's logic.
     *
     * Must be implemented in the subclass.
     *
     * @returns Exit code or void.
     */
    abstract execute(): Promise<number | void>;
    /**
     * Lifecycle hook that runs before command execution.
     *
     * Override this method to add pre-execution checks or setup.
     *
     * @returns True if execution should proceed, false to abort.
     */
    beforeExecute(): Promise<boolean>;
    /**
     * Lifecycle hook that runs after command execution.
     *
     * Override this method to add post-processing or cleanup.
     *
     * @param exitCode - The result of command execution.
     */
    afterExecute(exitCode: number | void): Promise<void>;
    /**
     * Writes a simple message line to output.
     *
     * @param message - The message to write.
     */
    protected line(message?: string): void;
    /**
     * Writes an informational message to output.
     *
     * @param message - The message to write.
     */
    protected info(message: string): void;
    /**
     * Writes a success message to output.
     *
     * @param message - The message to write.
     */
    protected success(message: string): void;
    /**
     * Writes an error message to output.
     *
     * @param message - The message to write.
     */
    protected error(message: string): void;
    /**
     * Writes a warning message to output.
     *
     * @param message - The message to write.
     */
    protected warning(message: string): void;
    /**
     * Writes a comment-style message to output.
     *
     * @param message - The message to write.
     */
    protected comment(message: string): void;
}

export { BaseCommand };
