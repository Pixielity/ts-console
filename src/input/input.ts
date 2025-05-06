import type { IInput } from '@pixielity/ts-types'

/**
 * Implementation of the IInput interface
 *
 * Parses command line arguments and provides access to them.
 */
export class Input implements IInput {
  /**
   * The command name
   * @private
   */
  private commandName?: string

  /**
   * Map of argument names to values
   * @private
   */
  private args: Record<string, string> = {}

  /**
   * Map of option names to values
   * @private
   */
  private opts: Record<string, string | boolean> = {}

  /**
   * Creates a new Input instance
   *
   * @param {string[]} argv - The command line arguments
   */
  constructor(argv: string[]) {
    this.parse(argv)
  }

  /**
   * Gets the command name from the input
   *
   * @returns {string | undefined} The command name or undefined if not provided
   */
  public getCommandName(): string | undefined {
    return this.commandName
  }

  /**
   * Gets an argument value by name
   *
   * @param {string} name - The name of the argument
   * @returns {string | undefined} The argument value or undefined if not provided
   */
  public getArgument(name: string): string | undefined {
    return this.args[name]
  }

  /**
   * Gets all arguments
   *
   * @returns {Record<string, string>} Map of argument names to values
   */
  public getArguments(): Record<string, string> {
    return { ...this.args }
  }

  /**
   * Gets an option value by name
   *
   * @param {string} name - The name of the option
   * @returns {string | boolean | undefined} The option value or undefined if not provided
   */
  public getOption(name: string): string | boolean | undefined {
    return this.opts[name]
  }

  /**
   * Gets all options
   *
   * @returns {Record<string, string | boolean>} Map of option names to values
   */
  public getOptions(): Record<string, string | boolean> {
    return { ...this.opts }
  }

  /**
   * Checks if an option is set
   *
   * @param {string} name - The name of the option
   * @returns {boolean} True if the option is set, false otherwise
   */
  public hasOption(name: string): boolean {
    return name in this.opts
  }

  /**
   * Parses the command line arguments
   *
   * @param {string[]} argv - The command line arguments
   * @private
   */
  private parse(argv: string[]): void {
    if (argv.length === 0) {
      return
    }

    // First argument is the command name
    this.commandName = argv[0]

    let i = 1
    let currentArgName = 0

    while (i < argv.length) {
      const arg = argv[i]

      // Handle options (--option or -o)
      if (arg.startsWith('--')) {
        const optName = arg.substring(2)

        // Handle --option=value
        if (optName.includes('=')) {
          const [name, value] = optName.split('=', 2)
          this.opts[name] = value
        } else {
          // Handle --option value or --option (boolean flag)
          if (i + 1 < argv.length && !argv[i + 1].startsWith('-')) {
            this.opts[optName] = argv[i + 1]
            i++
          } else {
            this.opts[optName] = true
          }
        }
      } else if (arg.startsWith('-')) {
        const optName = arg.substring(1)

        // Handle -o=value
        if (optName.includes('=')) {
          const [name, value] = optName.split('=', 2)
          this.opts[name] = value
        } else {
          // Handle -o value or -o (boolean flag)
          if (i + 1 < argv.length && !argv[i + 1].startsWith('-')) {
            this.opts[optName] = argv[i + 1]
            i++
          } else {
            this.opts[optName] = true
          }
        }
      } else {
        // Handle positional arguments
        this.args[currentArgName.toString()] = arg
        currentArgName++
      }

      i++
    }
  }
}
