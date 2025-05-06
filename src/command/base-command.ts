import type {
  IAsk,
  ICommand,
  IProgressBar,
  IProgressBarFormat,
  ITableOutput,
  ITableStyle,
} from '@pixielity/ts-types'
import type { IInput } from '@pixielity/ts-types'
import type { IOutput } from '@pixielity/ts-types'

import { Input } from '../input/input'
import { Output } from '../output/output'
import { COMMAND_METADATA_KEY } from '../decorators'
import { Ask, ProgressBar, TableOutput } from '../ui'

/**
 * Abstract base class for console commands.
 *
 * Provides a consistent structure and common functionality for defining and executing
 * commands in the console. Supports Laravel/Symfony-inspired argument and option handling.
 */
export abstract class BaseCommand implements ICommand {
  /**
   * Exit code for successful execution.
   */
  public static readonly SUCCESS = 0

  /**
   * Exit code indicating a general failure.
   */
  public static readonly FAILURE = 1

  /**
   * Exit code for invalid user input.
   */
  public static readonly INVALID = 2

  /**
   * Name of the command.
   * Defined in the constructor or through the `@Command` decorator metadata.
   */
  protected name: string

  /**
   * Description of the command.
   * Shown in help output and can be set via constructor or metadata.
   */
  protected description: string

  /**
   * Input instance for handling command-line arguments and options.
   */
  protected input: IInput

  /**
   * Output instance for writing messages to the terminal.
   */
  protected output: IOutput

  /**
   * Creates a new instance of the BaseCommand.
   *
   * @param name - The name of the command (optional if using decorator)
   * @param description - The description of the command
   * @throws Will throw if name is missing and no decorator metadata is found.
   */
  constructor(name?: string, description = '') {
    const metadata = Reflect.getMetadata(COMMAND_METADATA_KEY, this.constructor)

    if (!name && metadata?.name) {
      this.name = metadata.name
      this.description = description || metadata.description || ''
    } else if (name) {
      this.name = name
      this.description = description
    } else {
      throw new Error(`Command name is required. Provide it via constructor or @Command decorator.`)
    }

    this.input = new Input([])
    this.output = new Output()
  }

  /**
   * Returns the name of the command.
   *
   * @returns The command name.
   */
  public getName(): string {
    return this.name
  }

  /**
   * Returns the description of the command.
   *
   * @returns The command description.
   */
  public getDescription(): string {
    return this.description
  }

  /**
   * Sets the input instance used by this command.
   *
   * @param input - The input instance.
   */
  public setInput(input: IInput): void {
    this.input = input
  }

  /**
   * Retrieves the current input instance.
   *
   * @returns The input instance.
   */
  public getInput(): IInput {
    return this.input
  }

  /**
   * Sets the output instance used by this command.
   *
   * @param output - The output instance.
   */
  public setOutput(output: IOutput): void {
    this.output = output
  }

  /**
   * Retrieves the current output instance.
   *
   * @returns The output instance.
   */
  public getOutput(): IOutput {
    return this.output
  }

  /**
   * Sets multiple arguments for the command.
   *
   * @param args - Positional arguments as an array.
   */
  public setArguments(args: string[]): void {
    args.forEach((arg, index) => {
      ;(this.input as any).args[index.toString()] = arg
    })
  }

  /**
   * Sets a single named argument.
   *
   * @param key - The argument name.
   * @param value - The argument value.
   */
  public setArgument(key: string, value: any): void {
    ;(this.input as any).args[key] = value
  }

  /**
   * Retrieves all arguments as a key-value object.
   *
   * @returns Object containing all arguments.
   */
  public getArguments(): Record<string, any> {
    return (this.input as any).args || {}
  }

  /**
   * Retrieves a single argument by name.
   *
   * @param key - The argument name.
   * @returns The value of the argument or undefined if not found.
   */
  public getArgument<T = any>(key: string): T | undefined {
    return (this.input as any).args?.[key]
  }

  /**
   * Sets multiple options for the command.
   *
   * @param options - Object of option keys and values.
   */
  public setOptions(options: Record<string, any>): void {
    Object.entries(options).forEach(([key, value]) => {
      ;(this.input as any).opts[key] = value
    })
  }

  /**
   * Sets a single named option.
   *
   * @param key - The option name.
   * @param value - The option value.
   */
  public setOption(key: string, value: any): void {
    ;(this.input as any).opts[key] = value
  }

  /**
   * Retrieves all options as a key-value object.
   *
   * @returns Object containing all options.
   */
  public getOptions(): Record<string, any> {
    return (this.input as any).opts || {}
  }

  /**
   * Retrieves a single option by name.
   *
   * @param key - The option name.
   * @returns The value of the option or undefined if not found.
   */
  public getOption<T = any>(key: string): T | undefined {
    return (this.input as any).opts?.[key]
  }

  /**
   * Configures arguments and options.
   *
   * Should be overridden in the subclass to define expected inputs.
   */
  public configure(): void {
    // To be implemented in subclasses
  }

  /**
   * Abstract method that executes the command's logic.
   *
   * Must be implemented in the subclass.
   *
   * @returns Exit code or void.
   */
  public abstract execute(): Promise<number | void>

  /**
   * Lifecycle hook that runs before command execution.
   *
   * Override this method to add pre-execution checks or setup.
   *
   * @returns True if execution should proceed, false to abort.
   */
  public async beforeExecute(): Promise<boolean> {
    return true
  }

  /**
   * Lifecycle hook that runs after command execution.
   *
   * Override this method to add post-processing or cleanup.
   *
   * @param exitCode - The result of command execution.
   */
  public async afterExecute(exitCode: number | void): Promise<void> {
    // Optional: post-execution logic
  }

  /**
   * Ask utility class
   *
   * @returns Ask utility class
   */
  public ask(): IAsk {
    return Ask
  }

  /**
   * Creates a new ProgressBar instance
   *
   * @param {number} total - The total value
   * @param {IProgressBarFormat} format - The format options
   */
  public progress(total = 100, format?: IProgressBarFormat): IProgressBar {
    return new ProgressBar(total, format)
  }

  /**
   * Creates a new TableOutput instance
   *
   * @param {string[]} headers - The table headers
   * @param {ITableStyle} style - The table style
   */
  public table(headers: string[] = [], style?: ITableStyle): ITableOutput {
    return new TableOutput(headers, style)
  }

  /**
   * Writes a simple message line to output.
   *
   * @param message - The message to write.
   */
  protected line(message = ''): void {
    this.output.writeln(message)
  }

  /**
   * Writes an informational message to output.
   *
   * @param message - The message to write.
   */
  protected info(message: string): void {
    this.output.info(message)
  }

  /**
   * Writes a success message to output.
   *
   * @param message - The message to write.
   */
  protected success(message: string): void {
    this.output.success(message)
  }

  /**
   * Writes an error message to output.
   *
   * @param message - The message to write.
   */
  protected error(message: string): void {
    this.output.error(message)
  }

  /**
   * Writes a warning message to output.
   *
   * @param message - The message to write.
   */
  protected warning(message: string): void {
    this.output.warning(message)
  }

  /**
   * Writes a comment-style message to output.
   *
   * @param message - The message to write.
   */
  protected comment(message: string): void {
    this.output.comment(message)
  }
}
