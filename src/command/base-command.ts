import type { ICommand } from '@pixielity/ts-types'
import type { IInput } from '@pixielity/ts-types'
import type { IOutput } from '@pixielity/ts-types'
import { Input } from '../input/input'
import { Output } from '../output/output'
import { COMMAND_METADATA_KEY } from '../decorators'

/**
 * Abstract base class for console commands
 *
 * Provides common functionality for all commands.
 */
export abstract class BaseCommand implements ICommand {
  /**
   * Success exit code (0)
   * @static
   */
  public static readonly SUCCESS = 0

  /**
   * Failure exit code (1)
   * @static
   */
  public static readonly FAILURE = 1

  /**
   * Invalid input exit code (2)
   * @static
   */
  public static readonly INVALID = 2

  /**
   * The name of the command
   * @protected
   */
  protected name: string

  /**
   * The description of the command
   * @protected
   */
  protected description: string

  /**
   * The input instance
   * @protected
   */
  protected input: IInput

  /**
   * The output instance
   * @protected
   */
  protected output: IOutput

  /**
   * Creates a new BaseCommand instance
   *
   * @param {string} [name] - The name of the command (optional)
   * @param {string} [description] - The description of the command (optional)
   */
  constructor(name?: string, description = '') {
    // If name is not provided, try to get it from metadata
    if (name === undefined || name === null) {
      const metadata = Reflect.getMetadata(COMMAND_METADATA_KEY, this.constructor)

      if (metadata && metadata.name) {
        this.name = metadata.name

        // If description is empty, also get it from metadata
        if (!description && metadata.description) {
          this.description = metadata.description
        } else {
          this.description = description
        }
      } else {
        throw new Error(
          `Command name is required. Either provide it in the constructor or use the @Command decorator.`,
        )
      }
    } else {
      this.name = name
      this.description = description
    }

    this.input = new Input([])
    this.output = new Output()
  }

  /**
   * Gets the name of the command
   *
   * @returns {string} The command name
   */
  public getName(): string {
    return this.name
  }

  /**
   * Gets the description of the command
   *
   * @returns {string} The command description
   */
  public getDescription(): string {
    return this.description
  }

  /**
   * Sets the input instance
   *
   * @param {IInput} input - The input instance
   */
  public setInput(input: IInput): void {
    this.input = input
  }

  /**
   * Gets the input instance
   *
   * @returns {IInput} The input instance
   */
  public getInput(): IInput {
    return this.input
  }

  /**
   * Sets the output instance
   *
   * @param {IOutput} output - The output instance
   */
  public setOutput(output: IOutput): void {
    this.output = output
  }

  /**
   * Gets the output instance
   *
   * @returns {IOutput} The output instance
   */
  public getOutput(): IOutput {
    return this.output
  }

  /**
   * Sets the command arguments
   *
   * @param {string[]} args - The command arguments
   */
  public setArguments(args: string[]): void {
    // Access private property for initialization
    args.forEach((arg, index) => {
      ;(this.input as any).args[index.toString()] = arg
    })
  }

  /**
   * Sets the command options
   *
   * @param {Record<string, any>} options - The command options
   */
  public setOptions(options: Record<string, any>): void {
    // Access private property for initialization
    Object.entries(options).forEach(([key, value]) => {
      ;(this.input as any).opts[key] = value
    })
  }

  /**
   * Configures the command with options and arguments
   *
   * This method should be overridden by subclasses to define
   * command-specific options and arguments.
   */
  public configure(): void {
    // To be implemented by subclasses
  }

  /**
   * Executes the command
   *
   * This method must be implemented by subclasses to provide
   * command-specific functionality.
   *
   * @returns {Promise<number | void>} The exit code or void
   */
  public abstract execute(): Promise<number | void>

  /**
   * Hook that runs before command execution
   *
   * @returns {Promise<boolean>} True if execution should continue, false to abort
   */
  public async beforeExecute(): Promise<boolean> {
    return true
  }

  /**
   * Hook that runs after command execution
   *
   * @param {number | void} exitCode - The exit code from the command
   * @returns {Promise<void>}
   */
  public async afterExecute(exitCode: number | void): Promise<void> {
    // Default implementation does nothing
  }

  /**
   * Writes a line to the output
   *
   * @param {string} message - The message to write
   */
  protected line(message = ''): void {
    this.output.writeln(message)
  }

  /**
   * Writes an info message to the output
   *
   * @param {string} message - The message to write
   */
  protected info(message: string): void {
    this.output.info(message)
  }

  /**
   * Writes a success message to the output
   *
   * @param {string} message - The message to write
   */
  protected success(message: string): void {
    this.output.success(message)
  }

  /**
   * Writes an error message to the output
   *
   * @param {string} message - The message to write
   */
  protected error(message: string): void {
    this.output.error(message)
  }

  /**
   * Writes a warning message to the output
   *
   * @param {string} message - The message to write
   */
  protected warning(message: string): void {
    this.output.warning(message)
  }

  /**
   * Writes a comment message to the output
   *
   * @param {string} message - The message to write
   */
  protected comment(message: string): void {
    this.output.comment(message)
  }
}
