import 'reflect-metadata';
import chalk from 'chalk';
import { Command } from 'commander';
import { Container, injectable, inject } from 'inversify';
import { ICommandRegistry, ICommandCollector } from '@pixielity/ts-types';

/**
 * @pixielity/ts-console v1.0.0
 * 
 * Advanced console toolkit for Node.js applications
 * 
 * @license MIT
 * @copyright 2025 Your Name <your.email@example.com>
 */

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
var Output = class {
  /**
   * Writes a message to the output
   *
   * @param {string} message - The message to write
   */
  write(message) {
    process.stdout.write(message);
  }
  /**
   * Writes a message to the output followed by a newline
   *
   * @param {string} message - The message to write
   */
  writeln(message) {
    console.log(message);
  }
  /**
   * Writes an error message to the output
   *
   * @param {string} message - The error message to write
   */
  error(message) {
    console.error(chalk.bold.red("ERROR") + ": " + message);
  }
  /**
   * Writes a success message to the output
   *
   * @param {string} message - The success message to write
   */
  success(message) {
    console.log(chalk.bold.green("SUCCESS") + ": " + message);
  }
  /**
   * Writes an info message to the output
   *
   * @param {string} message - The info message to write
   */
  info(message) {
    console.log(chalk.bold.blue("INFO") + ": " + message);
  }
  /**
   * Writes a warning message to the output
   *
   * @param {string} message - The warning message to write
   */
  warning(message) {
    console.log(chalk.bold.yellow("WARNING") + ": " + message);
  }
  /**
   * Writes a comment message to the output
   *
   * @param {string} message - The comment message to write
   */
  comment(message) {
    console.log(chalk.gray("// " + message));
  }
};
var ARGUMENT_METADATA_KEY = Symbol("argument");
var OPTION_METADATA_KEY = Symbol("option");
new Container({
  defaultScope: "Singleton"
});

// src/decorators/command.decorator.ts
var COMMAND_METADATA_KEY = Symbol("command");

// src/application.ts
var Application = class {
  /**
   * Creates a new Console Application instance
   *
   * @param {ICommandRegistry} commandRegistry - The command registry
   * @param {ICommandCollector} commandCollector - The command collector
   * @param {ICommand[]} commands - The commands to register
   * @param {string} name - The name of the application
   * @param {string} version - The version of the application
   */
  constructor(commandRegistry, commandCollector, commands = [], name = "Next.js Console", version = "1.0.0") {
    /**
     * Map of shortcuts to command names
     * @private
     */
    this.shortcutMap = /* @__PURE__ */ new Map();
    this.name = name;
    this.version = version;
    this.commandRegistry = commandRegistry;
    this.commandCollector = commandCollector;
    this.program = new Command().name(this.name).version(this.version).description(`${this.name} - A Laravel/Symfony-inspired console for Next.js`).helpOption("-h, --help", "Display help for command").helpCommand("help [command]", "Display help for command");
    this.addGlobalOptions();
    if (commands.length > 0) {
      this.registerCommands(commands);
    }
  }
  /**
   * Add global options/shortcuts to the application
   *
   * @private
   */
  addGlobalOptions() {
  }
  /**
   * Register command-specific shortcuts
   *
   * @param {string} commandName - The name of the command
   * @param {CommandShortcut[]} shortcuts - The shortcuts to register
   * @private
   */
  registerCommandShortcuts(commandName, shortcuts) {
    shortcuts.forEach((shortcut) => {
      const flagParts = shortcut.flag.split(",").map((part) => part.trim());
      const shortFlag = flagParts[0];
      this.program.option(
        shortcut.flag,
        `${shortcut.description} (shortcut for "${commandName}")`,
        shortcut.defaultValue
      );
      this.shortcutMap.set(shortFlag, { command: commandName });
      if (flagParts.length > 1) {
        this.shortcutMap.set(flagParts[1], { command: commandName });
      }
    });
  }
  /**
   * Handle global options/shortcuts
   *
   * @param {any} options - The parsed options
   * @returns {Promise<boolean>} True if an option was handled, false otherwise
   * @private
   */
  async handleGlobalOptions(options) {
    if (options.list) {
      const listCommand = this.commandRegistry.get("list");
      if (listCommand) {
        listCommand.setOutput(new Output());
        await listCommand.execute();
        return true;
      }
    }
    if (options.greet !== void 0) {
      const greetCommand = this.commandRegistry.get("greet");
      if (greetCommand) {
        greetCommand.setOutput(new Output());
        if (typeof options.greet === "string") {
          greetCommand.setArguments([options.greet]);
        }
        await greetCommand.execute();
        return true;
      }
    }
    if (options.demo !== void 0) {
      const demoCommand = this.commandRegistry.get("demo");
      if (demoCommand) {
        demoCommand.setOutput(new Output());
        if (typeof options.demo === "string") {
          demoCommand.setOptions({ feature: options.demo });
        }
        await demoCommand.execute();
        return true;
      }
    }
    if (options.make) {
      const makeCommand = this.commandRegistry.get("make:command");
      if (makeCommand) {
        makeCommand.setOutput(new Output());
        makeCommand.setArguments([options.make]);
        await makeCommand.execute();
        return true;
      }
    }
    for (const [flag, commandInfo] of this.shortcutMap.entries()) {
      const optionName = flag.replace(/^-+/, "");
      if (options[optionName] !== void 0) {
        const command = this.commandRegistry.get(commandInfo.command);
        if (command) {
          command.setOutput(new Output());
          if (commandInfo.args) {
            command.setArguments(commandInfo.args);
          }
          if (commandInfo.options) {
            command.setOptions(commandInfo.options);
          }
          if (typeof options[optionName] === "string") {
            command.setArguments([options[optionName]]);
          }
          await command.execute();
          return true;
        }
      }
    }
    return false;
  }
  /**
   * Gets the name of the application
   *
   * @returns {string} The application name
   */
  getName() {
    return this.name;
  }
  /**
   * Sets the name of the application
   *
   * @param {string} name - The new application name
   * @returns {Application} The application instance for chaining
   */
  setName(name) {
    this.name = name;
    this.program.name(name);
    return this;
  }
  /**
   * Gets the version of the application
   *
   * @returns {string} The application version
   */
  getVersion() {
    return this.version;
  }
  /**
   * Sets the version of the application
   *
   * @param {string} version - The new application version
   * @returns {Application} The application instance for chaining
   */
  setVersion(version) {
    this.version = version;
    this.program.version(version);
    return this;
  }
  /**
   * Gets all registered commands
   *
   * @returns {ICommand[]} Array of all registered commands
   */
  getCommands() {
    return this.commandRegistry.getAll();
  }
  /**
   * Sets the commands for the application
   * This will clear existing commands and register the new ones
   *
   * @param {ICommand[]} commands - The commands to register
   * @returns {Application} The application instance for chaining
   */
  setCommands(commands) {
    this.commandRegistry.clear();
    this.shortcutMap.clear();
    this.program = new Command().name(this.name).version(this.version).description(`${this.name} - A Laravel/Symfony-inspired console for Next.js`).helpOption("-h, --help", "Display help for command").addHelpCommand("help [command]", "Display help for command");
    this.addGlobalOptions();
    this.registerCommands(commands);
    return this;
  }
  /**
   * Gets the command registry
   *
   * @returns {ICommandRegistry} The command registry
   */
  getCommandRegistry() {
    return this.commandRegistry;
  }
  /**
   * Gets the command collector
   *
   * @returns {ICommandCollector} The command collector
   */
  getCommandCollector() {
    return this.commandCollector;
  }
  /**
   * Registers a command with the application
   *
   * @param {ICommand} command - The command to register
   * @returns {Application} - The application instance for chaining
   */
  register(command) {
    this.commandRegistry.add(command);
    this.registerWithCommander(command);
    return this;
  }
  /**
   * Registers multiple commands with the application
   *
   * @param {ICommand[]} commands - The commands to register
   * @returns {Application} - The application instance for chaining
   */
  registerCommands(commands) {
    commands.forEach((command) => this.register(command));
    return this;
  }
  /**
   * Discovers and registers commands from a directory
   *
   * @param {string} directory - The directory to scan for commands
   * @param {string} pattern - The glob pattern to match command files
   * @returns {Promise<Application>} - The application instance for chaining
   */
  async discoverCommands(directory, pattern = "**/*-command.{ts,js}") {
    const commands = await this.commandCollector.discoverCommands(directory, pattern);
    this.registerCommands(commands);
    return this;
  }
  /**
   * Registers a command with Commander.js
   *
   * @param {ICommand} command - The command to register
   * @private
   */
  registerWithCommander(command) {
    const metadata = Reflect.getMetadata(COMMAND_METADATA_KEY, command.constructor) || {};
    if (metadata.hidden) {
      return;
    }
    const commanderCommand = new Command(command.getName()).description(command.getDescription()).action(async (...args) => {
      try {
        const options = args.pop() || {};
        command.setOutput(new Output());
        command.setArguments(args);
        command.setOptions(options);
        if (command.beforeExecute) {
          const shouldContinue = await command.beforeExecute();
          if (!shouldContinue) {
            return;
          }
        }
        const exitCode = await command.execute();
        if (command.afterExecute) {
          await command.afterExecute(exitCode);
        }
        if (exitCode !== 0 && exitCode !== void 0) {
          process.exit(exitCode);
        }
      } catch (error) {
        console.error(
          chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`)
        );
        process.exit(1);
      }
    });
    if (metadata.aliases && Array.isArray(metadata.aliases)) {
      commanderCommand.aliases(metadata.aliases);
    }
    if (metadata.shortcuts && Array.isArray(metadata.shortcuts)) {
      this.registerCommandShortcuts(command.getName(), metadata.shortcuts);
    }
    this.program.addCommand(commanderCommand);
    this.processCommandMetadata(command, commanderCommand);
  }
  /**
   * Processes command metadata from decorators
   *
   * @param {ICommand} command - The command instance
   * @param {Command} commanderCommand - The Commander.js command
   * @private
   */
  processCommandMetadata(command, commanderCommand) {
    const constructor = command.constructor;
    const argumentsMetadata = Reflect.getMetadata(ARGUMENT_METADATA_KEY, constructor) || [];
    argumentsMetadata.forEach((metadata) => {
      commanderCommand.argument(metadata.name, metadata.description, metadata.defaultValue);
    });
    const optionsMetadata = Reflect.getMetadata(OPTION_METADATA_KEY, constructor) || [];
    optionsMetadata.forEach((metadata) => {
      commanderCommand.option(metadata.flags, metadata.description, metadata.defaultValue);
    });
  }
  /**
   * Runs the application with the given arguments
   *
   * @param {string[]} argv - The command line arguments
   * @returns {Promise<void>}
   */
  async run(argv = process.argv) {
    try {
      this.program.allowUnknownOption(true);
      const operands = this.program.parseOptions(argv.slice(2)).operands;
      const options = this.program.opts();
      const optionsHandled = await this.handleGlobalOptions(options);
      if (optionsHandled) {
        return;
      }
      await this.program.parseAsync(argv);
    } catch (error) {
      console.error(
        chalk.red(`Fatal error: ${error instanceof Error ? error.message : String(error)}`)
      );
      process.exit(1);
    }
  }
};
Application = __decorateClass([
  injectable(),
  __decorateParam(0, inject(ICommandRegistry.$)),
  __decorateParam(1, inject(ICommandCollector.$))
], Application);

export { Application };
//# sourceMappingURL=application.mjs.map
//# sourceMappingURL=application.mjs.map