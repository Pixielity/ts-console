import 'reflect-metadata'
import chalk from 'chalk'
import { Command } from 'commander'
import { inject, injectable } from 'inversify'
import type { ICommand } from '@pixielity/ts-types'
import type { IConsoleApplication } from '@pixielity/ts-types'
import { ICommandCollector, ICommandRegistry, ICommandShortcut } from '@pixielity/ts-types'

import { Output } from './output/output'
import { ARGUMENT_METADATA_KEY } from './decorators/argument.decorator'
import { OPTION_METADATA_KEY } from './decorators/option.decorator'
import { COMMAND_METADATA_KEY } from './decorators/command.decorator'

/**
 * Console Application class
 *
 * Manages the console commands and their execution using Commander.js.
 */
@injectable()
export class Application implements IConsoleApplication {
  /**
   * The name of the application
   * @private
   */
  private name: string

  /**
   * The version of the application
   * @private
   */
  private version: string

  /**
   * The command registry that stores all registered commands
   * @private
   */
  private commandRegistry: ICommandRegistry

  /**
   * The command collector for discovering commands
   * @private
   */
  private commandCollector: ICommandCollector

  /**
   * The Commander.js program instance
   * @private
   */
  private program: Command

  /**
   * Map of shortcuts to command names
   * @private
   */
  private shortcutMap: Map<
    string,
    { command: string; args?: string[]; options?: Record<string, any> }
  > = new Map()

  /**
   * Creates a new Console Application instance
   *
   * @param {ICommandRegistry} commandRegistry - The command registry
   * @param {ICommandCollector} commandCollector - The command collector
   * @param {ICommand[]} commands - The commands to register
   * @param {string} name - The name of the application
   * @param {string} version - The version of the application
   */
  constructor(
    @inject(ICommandRegistry.$) commandRegistry: ICommandRegistry,
    @inject(ICommandCollector.$) commandCollector: ICommandCollector,
    commands: ICommand[] = [],
    name = 'Next.js Console',
    version = '1.0.0',
  ) {
    this.name = name
    this.version = version
    this.commandRegistry = commandRegistry
    this.commandCollector = commandCollector

    // Initialize Commander program
    this.program = new Command()
      .name(this.name)
      .version(this.version)
      .description(`${this.name} - A Laravel/Symfony-inspired console for Next.js`)
      .helpOption('-h, --help', 'Display help for command')
      .helpCommand('help [command]', 'Display help for command')

    // Add global options (shortcuts)
    this.addGlobalOptions()

    // Register commands
    if (commands.length > 0) {
      this.registerCommands(commands)
    }
  }

  /**
   * Add global options/shortcuts to the application
   *
   * @private
   */
  private addGlobalOptions(): void {
    // implement global options
  }

  /**
   * Register command-specific shortcuts
   *
   * @param {string} commandName - The name of the command
   * @param {CommandShortcut[]} shortcuts - The shortcuts to register
   * @private
   */
  private registerCommandShortcuts(commandName: string, shortcuts: ICommandShortcut[]): void {
    shortcuts.forEach((shortcut) => {
      // Extract the short flag from the shortcut (e.g., "-l" from "-l, --list")
      const flagParts = shortcut.flag.split(',').map((part: string) => part.trim())
      const shortFlag = flagParts[0]

      // Add the option to the program
      this.program.option(
        shortcut.flag,
        `${shortcut.description} (shortcut for "${commandName}")`,
        shortcut.defaultValue,
      )

      // Map the shortcut to the command
      this.shortcutMap.set(shortFlag, { command: commandName })

      // If there's a long flag version, map that too
      if (flagParts.length > 1) {
        this.shortcutMap.set(flagParts[1], { command: commandName })
      }
    })
  }

  /**
   * Handle global options/shortcuts
   *
   * @param {any} options - The parsed options
   * @returns {Promise<boolean>} True if an option was handled, false otherwise
   * @private
   */
  private async handleGlobalOptions(options: any): Promise<boolean> {
    // Handle built-in global shortcuts
    if (options.list) {
      // Run the list command
      const listCommand = this.commandRegistry.get('list')
      if (listCommand) {
        listCommand.setOutput(new Output())
        await listCommand.execute()
        return true
      }
    }

    if (options.greet !== undefined) {
      // Run the greet command
      const greetCommand = this.commandRegistry.get('greet')
      if (greetCommand) {
        greetCommand.setOutput(new Output())
        if (typeof options.greet === 'string') {
          greetCommand.setArguments([options.greet])
        }
        await greetCommand.execute()
        return true
      }
    }

    if (options.demo !== undefined) {
      // Run the demo command
      const demoCommand = this.commandRegistry.get('demo')
      if (demoCommand) {
        demoCommand.setOutput(new Output())
        if (typeof options.demo === 'string') {
          demoCommand.setOptions({ feature: options.demo })
        }
        await demoCommand.execute()
        return true
      }
    }

    if (options.make) {
      // Run the make:command command
      const makeCommand = this.commandRegistry.get('make:command')
      if (makeCommand) {
        makeCommand.setOutput(new Output())
        makeCommand.setArguments([options.make])
        await makeCommand.execute()
        return true
      }
    }

    // Handle command-specific shortcuts
    for (const [flag, commandInfo] of this.shortcutMap.entries()) {
      // Remove the leading dash(es) to get the option name
      const optionName = flag.replace(/^-+/, '')

      if (options[optionName] !== undefined) {
        const command = this.commandRegistry.get(commandInfo.command)
        if (command) {
          command.setOutput(new Output())

          // Set arguments if provided
          if (commandInfo.args) {
            command.setArguments(commandInfo.args)
          }

          // Set options if provided
          if (commandInfo.options) {
            command.setOptions(commandInfo.options)
          }

          // If the option has a value, pass it as an argument
          if (typeof options[optionName] === 'string') {
            command.setArguments([options[optionName]])
          }

          await command.execute()
          return true
        }
      }
    }

    return false
  }

  /**
   * Gets the name of the application
   *
   * @returns {string} The application name
   */
  public getName(): string {
    return this.name
  }

  /**
   * Sets the name of the application
   *
   * @param {string} name - The new application name
   * @returns {Application} The application instance for chaining
   */
  public setName(name: string): Application {
    this.name = name
    this.program.name(name)
    return this
  }

  /**
   * Gets the version of the application
   *
   * @returns {string} The application version
   */
  public getVersion(): string {
    return this.version
  }

  /**
   * Sets the version of the application
   *
   * @param {string} version - The new application version
   * @returns {Application} The application instance for chaining
   */
  public setVersion(version: string): Application {
    this.version = version
    this.program.version(version)
    return this
  }

  /**
   * Gets all registered commands
   *
   * @returns {ICommand[]} Array of all registered commands
   */
  public getCommands(): ICommand[] {
    return this.commandRegistry.getAll()
  }

  /**
   * Sets the commands for the application
   * This will clear existing commands and register the new ones
   *
   * @param {ICommand[]} commands - The commands to register
   * @returns {Application} The application instance for chaining
   */
  public setCommands(commands: ICommand[]): Application {
    // Clear existing commands
    this.commandRegistry.clear()

    // Clear shortcut map
    this.shortcutMap.clear()

    // Re-initialize the program to clear Commander commands
    this.program = new Command()
      .name(this.name)
      .version(this.version)
      .description(`${this.name} - A Laravel/Symfony-inspired console for Next.js`)
      .helpOption('-h, --help', 'Display help for command')
      .addHelpCommand('help [command]', 'Display help for command')

    // Add global options
    this.addGlobalOptions()

    // Register the new commands
    this.registerCommands(commands)

    return this
  }

  /**
   * Gets the command registry
   *
   * @returns {ICommandRegistry} The command registry
   */
  public getCommandRegistry(): ICommandRegistry {
    return this.commandRegistry
  }

  /**
   * Gets the command collector
   *
   * @returns {ICommandCollector} The command collector
   */
  public getCommandCollector(): ICommandCollector {
    return this.commandCollector
  }

  /**
   * Registers a command with the application
   *
   * @param {ICommand} command - The command to register
   * @returns {Application} - The application instance for chaining
   */
  public register(command: ICommand): Application {
    this.commandRegistry.add(command)

    // Register with Commander
    this.registerWithCommander(command)

    return this
  }

  /**
   * Registers multiple commands with the application
   *
   * @param {ICommand[]} commands - The commands to register
   * @returns {Application} - The application instance for chaining
   */
  public registerCommands(commands: ICommand[]): Application {
    commands.forEach((command) => this.register(command))
    return this
  }

  /**
   * Discovers and registers commands from a directory
   *
   * @param {string} directory - The directory to scan for commands
   * @param {string} pattern - The glob pattern to match command files
   * @returns {Promise<Application>} - The application instance for chaining
   */
  public async discoverCommands(
    directory: string,
    pattern = '**/*-command.{ts,js}',
  ): Promise<Application> {
    const commands = await this.commandCollector.discoverCommands(directory, pattern)
    this.registerCommands(commands)
    return this
  }

  /**
   * Registers a command with Commander.js
   *
   * @param {ICommand} command - The command to register
   * @private
   */
  private registerWithCommander(command: ICommand): void {
    // Get command metadata if available
    const metadata = Reflect.getMetadata(COMMAND_METADATA_KEY, command.constructor) || {}

    // Skip hidden commands
    if (metadata.hidden) {
      return
    }

    const commanderCommand = new Command(command.getName())
      .description(command.getDescription())
      .action(async (...args) => {
        try {
          // Extract options from the last argument (Commander passes options as last arg)
          const options = args.pop() || {}

          // Set output
          command.setOutput(new Output())

          // Set arguments and options
          command.setArguments(args)
          command.setOptions(options)

          // Run before execute hook if it exists
          if (command.beforeExecute) {
            const shouldContinue = await command.beforeExecute()
            if (!shouldContinue) {
              return
            }
          }

          // Execute the command
          const exitCode = await command.execute()

          // Run after execute hook if it exists
          if (command.afterExecute) {
            await command.afterExecute(exitCode)
          }

          if (exitCode !== 0 && exitCode !== undefined) {
            process.exit(exitCode)
          }
        } catch (error) {
          console.error(
            chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`),
          )
          process.exit(1)
        }
      })

    // Add aliases if available
    if (metadata.aliases && Array.isArray(metadata.aliases)) {
      commanderCommand.aliases(metadata.aliases)
    }

    // Register shortcuts if available
    if (metadata.shortcuts && Array.isArray(metadata.shortcuts)) {
      this.registerCommandShortcuts(command.getName(), metadata.shortcuts)
    }

    // Add command to the program
    this.program.addCommand(commanderCommand)

    // Process command metadata if available (from decorators)
    this.processCommandMetadata(command, commanderCommand)
  }

  /**
   * Processes command metadata from decorators
   *
   * @param {ICommand} command - The command instance
   * @param {Command} commanderCommand - The Commander.js command
   * @private
   */
  private processCommandMetadata(command: ICommand, commanderCommand: Command): void {
    const constructor = command.constructor

    // Process arguments
    const argumentsMetadata = Reflect.getMetadata(ARGUMENT_METADATA_KEY, constructor) || []
    argumentsMetadata.forEach((metadata: any) => {
      commanderCommand.argument(metadata.name, metadata.description, metadata.defaultValue)
    })

    // Process options
    const optionsMetadata = Reflect.getMetadata(OPTION_METADATA_KEY, constructor) || []
    optionsMetadata.forEach((metadata: any) => {
      commanderCommand.option(metadata.flags, metadata.description, metadata.defaultValue)
    })
  }

  /**
   * Runs the application with the given arguments
   *
   * @param {string[]} argv - The command line arguments
   * @returns {Promise<void>}
   */
  public async run(argv: string[] = process.argv): Promise<void> {
    try {
      // Parse options without executing a command
      this.program.allowUnknownOption(true)
      const operands = this.program.parseOptions(argv.slice(2)).operands
      const options = this.program.opts()

      // Handle global options first
      const optionsHandled = await this.handleGlobalOptions(options)

      if (optionsHandled) {
        return
      }

      // If no global options were handled, parse normally
      await this.program.parseAsync(argv)
    } catch (error) {
      console.error(
        chalk.red(`Fatal error: ${error instanceof Error ? error.message : String(error)}`),
      )
      process.exit(1)
    }
  }
}
