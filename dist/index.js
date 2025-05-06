'use strict';

var chalk6 = require('chalk');
require('reflect-metadata');
var inversify = require('inversify');
var tsTypes = require('@pixielity/ts-types');
var commander = require('commander');
var inquirer = require('inquirer');
var Table = require('cli-table3');
var cliProgress = require('cli-progress');
var path2 = require('path');
var fs2 = require('fs');
var glob = require('glob');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var chalk6__default = /*#__PURE__*/_interopDefault(chalk6);
var inquirer__default = /*#__PURE__*/_interopDefault(inquirer);
var Table__default = /*#__PURE__*/_interopDefault(Table);
var cliProgress__default = /*#__PURE__*/_interopDefault(cliProgress);
var path2__namespace = /*#__PURE__*/_interopNamespace(path2);
var fs2__namespace = /*#__PURE__*/_interopNamespace(fs2);

/**
 * @pixielity/ts-console v1.0.0
 * 
 * Advanced console toolkit for Node.js applications
 * 
 * @license MIT
 * @copyright 2025 Your Name <your.email@example.com>
 */

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);

// src/input/input.ts
var Input = class {
  /**
   * Creates a new Input instance
   *
   * @param {string[]} argv - The command line arguments
   */
  constructor(argv) {
    /**
     * Map of argument names to values
     * @private
     */
    this.args = {};
    /**
     * Map of option names to values
     * @private
     */
    this.opts = {};
    this.parse(argv);
  }
  /**
   * Gets the command name from the input
   *
   * @returns {string | undefined} The command name or undefined if not provided
   */
  getCommandName() {
    return this.commandName;
  }
  /**
   * Gets an argument value by name
   *
   * @param {string} name - The name of the argument
   * @returns {string | undefined} The argument value or undefined if not provided
   */
  getArgument(name) {
    return this.args[name];
  }
  /**
   * Gets all arguments
   *
   * @returns {Record<string, string>} Map of argument names to values
   */
  getArguments() {
    return { ...this.args };
  }
  /**
   * Gets an option value by name
   *
   * @param {string} name - The name of the option
   * @returns {string | boolean | undefined} The option value or undefined if not provided
   */
  getOption(name) {
    return this.opts[name];
  }
  /**
   * Gets all options
   *
   * @returns {Record<string, string | boolean>} Map of option names to values
   */
  getOptions() {
    return { ...this.opts };
  }
  /**
   * Checks if an option is set
   *
   * @param {string} name - The name of the option
   * @returns {boolean} True if the option is set, false otherwise
   */
  hasOption(name) {
    return name in this.opts;
  }
  /**
   * Parses the command line arguments
   *
   * @param {string[]} argv - The command line arguments
   * @private
   */
  parse(argv) {
    if (argv.length === 0) {
      return;
    }
    this.commandName = argv[0];
    let i = 1;
    let currentArgName = 0;
    while (i < argv.length) {
      const arg = argv[i];
      if (arg.startsWith("--")) {
        const optName = arg.substring(2);
        if (optName.includes("=")) {
          const [name, value] = optName.split("=", 2);
          this.opts[name] = value;
        } else {
          if (i + 1 < argv.length && !argv[i + 1].startsWith("-")) {
            this.opts[optName] = argv[i + 1];
            i++;
          } else {
            this.opts[optName] = true;
          }
        }
      } else if (arg.startsWith("-")) {
        const optName = arg.substring(1);
        if (optName.includes("=")) {
          const [name, value] = optName.split("=", 2);
          this.opts[name] = value;
        } else {
          if (i + 1 < argv.length && !argv[i + 1].startsWith("-")) {
            this.opts[optName] = argv[i + 1];
            i++;
          } else {
            this.opts[optName] = true;
          }
        }
      } else {
        this.args[currentArgName.toString()] = arg;
        currentArgName++;
      }
      i++;
    }
  }
};
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
    console.error(chalk6__default.default.bold.red("ERROR") + ": " + message);
  }
  /**
   * Writes a success message to the output
   *
   * @param {string} message - The success message to write
   */
  success(message) {
    console.log(chalk6__default.default.bold.green("SUCCESS") + ": " + message);
  }
  /**
   * Writes an info message to the output
   *
   * @param {string} message - The info message to write
   */
  info(message) {
    console.log(chalk6__default.default.bold.blue("INFO") + ": " + message);
  }
  /**
   * Writes a warning message to the output
   *
   * @param {string} message - The warning message to write
   */
  warning(message) {
    console.log(chalk6__default.default.bold.yellow("WARNING") + ": " + message);
  }
  /**
   * Writes a comment message to the output
   *
   * @param {string} message - The comment message to write
   */
  comment(message) {
    console.log(chalk6__default.default.gray("// " + message));
  }
};
var ARGUMENT_METADATA_KEY = Symbol("argument");
function Argument(options) {
  return (target, propertyKey) => {
    let name = options.name;
    if (!options.required) {
      name = `[${name}]`;
    } else {
      name = `<${name}>`;
    }
    if (options.isArray) {
      name = `${name}...`;
    }
    const metadata = {
      name,
      description: options.description || "",
      defaultValue: options.defaultValue,
      propertyKey
    };
    const existingMetadata = Reflect.getMetadata(ARGUMENT_METADATA_KEY, target.constructor) || [];
    existingMetadata.push(metadata);
    Reflect.defineMetadata(ARGUMENT_METADATA_KEY, existingMetadata, target.constructor);
  };
}
var container = new inversify.Container({
  defaultScope: "Singleton"
});

// src/decorators/command.decorator.ts
var COMMAND_METADATA_KEY = Symbol("command");
function Command(options) {
  return (target) => {
    var _a, _b;
    const commandOptions = {
      ...options,
      hidden: (_a = options.hidden) != null ? _a : false,
      injectable: (_b = options.injectable) != null ? _b : true,
      description: options.description || "",
      shortcuts: options.shortcuts || []
    };
    Reflect.defineMetadata(COMMAND_METADATA_KEY, commandOptions, target);
    if (commandOptions.injectable) {
      inversify.injectable()(target);
      try {
        container.bind(tsTypes.ICommand.$).to(target).inSingletonScope();
      } catch (error) {
      }
    }
  };
}
var OPTION_METADATA_KEY = Symbol("option");
function Option(options) {
  return (target, propertyKey) => {
    const metadata = {
      flags: options.flags,
      description: options.description || "",
      defaultValue: options.defaultValue,
      propertyKey
    };
    const existingMetadata = Reflect.getMetadata(OPTION_METADATA_KEY, target.constructor) || [];
    existingMetadata.push(metadata);
    Reflect.defineMetadata(OPTION_METADATA_KEY, existingMetadata, target.constructor);
  };
}

// src/command/base-command.ts
var BaseCommand = class {
  /**
   * Creates a new instance of the BaseCommand.
   *
   * @param name - The name of the command (optional if using decorator)
   * @param description - The description of the command
   * @throws Will throw if name is missing and no decorator metadata is found.
   */
  constructor(name, description = "") {
    const metadata = Reflect.getMetadata(COMMAND_METADATA_KEY, this.constructor);
    if (!name && (metadata == null ? void 0 : metadata.name)) {
      this.name = metadata.name;
      this.description = description || metadata.description || "";
    } else if (name) {
      this.name = name;
      this.description = description;
    } else {
      throw new Error(`Command name is required. Provide it via constructor or @Command decorator.`);
    }
    this.input = new Input([]);
    this.output = new Output();
  }
  /**
   * Returns the name of the command.
   *
   * @returns The command name.
   */
  getName() {
    return this.name;
  }
  /**
   * Returns the description of the command.
   *
   * @returns The command description.
   */
  getDescription() {
    return this.description;
  }
  /**
   * Sets the input instance used by this command.
   *
   * @param input - The input instance.
   */
  setInput(input) {
    this.input = input;
  }
  /**
   * Retrieves the current input instance.
   *
   * @returns The input instance.
   */
  getInput() {
    return this.input;
  }
  /**
   * Sets the output instance used by this command.
   *
   * @param output - The output instance.
   */
  setOutput(output) {
    this.output = output;
  }
  /**
   * Retrieves the current output instance.
   *
   * @returns The output instance.
   */
  getOutput() {
    return this.output;
  }
  /**
   * Sets multiple arguments for the command.
   *
   * @param args - Positional arguments as an array.
   */
  setArguments(args) {
    args.forEach((arg, index) => {
      this.input.args[index.toString()] = arg;
    });
  }
  /**
   * Sets a single named argument.
   *
   * @param key - The argument name.
   * @param value - The argument value.
   */
  setArgument(key, value) {
    this.input.args[key] = value;
  }
  /**
   * Retrieves all arguments as a key-value object.
   *
   * @returns Object containing all arguments.
   */
  getArguments() {
    return this.input.args || {};
  }
  /**
   * Retrieves a single argument by name.
   *
   * @param key - The argument name.
   * @returns The value of the argument or undefined if not found.
   */
  getArgument(key) {
    var _a;
    return (_a = this.input.args) == null ? void 0 : _a[key];
  }
  /**
   * Sets multiple options for the command.
   *
   * @param options - Object of option keys and values.
   */
  setOptions(options) {
    Object.entries(options).forEach(([key, value]) => {
      this.input.opts[key] = value;
    });
  }
  /**
   * Sets a single named option.
   *
   * @param key - The option name.
   * @param value - The option value.
   */
  setOption(key, value) {
    this.input.opts[key] = value;
  }
  /**
   * Retrieves all options as a key-value object.
   *
   * @returns Object containing all options.
   */
  getOptions() {
    return this.input.opts || {};
  }
  /**
   * Retrieves a single option by name.
   *
   * @param key - The option name.
   * @returns The value of the option or undefined if not found.
   */
  getOption(key) {
    var _a;
    return (_a = this.input.opts) == null ? void 0 : _a[key];
  }
  /**
   * Configures arguments and options.
   *
   * Should be overridden in the subclass to define expected inputs.
   */
  configure() {
  }
  /**
   * Lifecycle hook that runs before command execution.
   *
   * Override this method to add pre-execution checks or setup.
   *
   * @returns True if execution should proceed, false to abort.
   */
  async beforeExecute() {
    return true;
  }
  /**
   * Lifecycle hook that runs after command execution.
   *
   * Override this method to add post-processing or cleanup.
   *
   * @param exitCode - The result of command execution.
   */
  async afterExecute(exitCode) {
  }
  /**
   * Writes a simple message line to output.
   *
   * @param message - The message to write.
   */
  line(message = "") {
    this.output.writeln(message);
  }
  /**
   * Writes an informational message to output.
   *
   * @param message - The message to write.
   */
  info(message) {
    this.output.info(message);
  }
  /**
   * Writes a success message to output.
   *
   * @param message - The message to write.
   */
  success(message) {
    this.output.success(message);
  }
  /**
   * Writes an error message to output.
   *
   * @param message - The message to write.
   */
  error(message) {
    this.output.error(message);
  }
  /**
   * Writes a warning message to output.
   *
   * @param message - The message to write.
   */
  warning(message) {
    this.output.warning(message);
  }
  /**
   * Writes a comment-style message to output.
   *
   * @param message - The message to write.
   */
  comment(message) {
    this.output.comment(message);
  }
};
/**
 * Exit code for successful execution.
 */
BaseCommand.SUCCESS = 0;
/**
 * Exit code indicating a general failure.
 */
BaseCommand.FAILURE = 1;
/**
 * Exit code for invalid user input.
 */
BaseCommand.INVALID = 2;
exports.CommandRegistry = class CommandRegistry {
  constructor() {
    /**
     * Map of command names to command instances
     * @private
     */
    this.commands = /* @__PURE__ */ new Map();
  }
  /**
   * Adds a command to the registry
   *
   * @param {ICommand} command - The command to add
   * @throws {Error} If a command with the same name already exists
   */
  add(command) {
    const name = command.getName();
    if (this.commands.has(name)) {
      throw new Error(`Command "${name}" already exists.`);
    }
    this.commands.set(name, command);
  }
  /**
   * Gets a command by name
   *
   * @param {string} name - The name of the command
   * @returns {ICommand | undefined} The command or undefined if not found
   */
  get(name) {
    return this.commands.get(name);
  }
  /**
   * Gets all registered commands
   *
   * @returns {ICommand[]} Array of all registered commands
   */
  getAll() {
    return Array.from(this.commands.values());
  }
  /**
   * Checks if a command exists
   *
   * @param {string} name - The name of the command
   * @returns {boolean} True if the command exists, false otherwise
   */
  has(name) {
    return this.commands.has(name);
  }
  /**
   * Removes a command from the registry
   *
   * @param {string} name - The name of the command
   * @returns {boolean} True if the command was removed, false otherwise
   */
  remove(name) {
    return this.commands.delete(name);
  }
  /**
   * Clears all commands from the registry
   */
  clear() {
    this.commands.clear();
  }
};
exports.CommandRegistry = __decorateClass([
  inversify.injectable()
], exports.CommandRegistry);
exports.Application = class Application {
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
    this.program = new commander.Command().name(this.name).version(this.version).description(`${this.name} - A Laravel/Symfony-inspired console for Next.js`).helpOption("-h, --help", "Display help for command").helpCommand("help [command]", "Display help for command");
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
    this.program = new commander.Command().name(this.name).version(this.version).description(`${this.name} - A Laravel/Symfony-inspired console for Next.js`).helpOption("-h, --help", "Display help for command").addHelpCommand("help [command]", "Display help for command");
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
    const commanderCommand = new commander.Command(command.getName()).description(command.getDescription()).action(async (...args) => {
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
          chalk6__default.default.red(`Error: ${error instanceof Error ? error.message : String(error)}`)
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
        chalk6__default.default.red(`Fatal error: ${error instanceof Error ? error.message : String(error)}`)
      );
      process.exit(1);
    }
  }
};
exports.Application = __decorateClass([
  inversify.injectable(),
  __decorateParam(0, inversify.inject(tsTypes.ICommandRegistry.$)),
  __decorateParam(1, inversify.inject(tsTypes.ICommandCollector.$))
], exports.Application);
exports.Ask = class Ask {
  /**
   * Asks a single question
   *
   * @param {IQuestion} question - The question to ask
   * @returns {Promise<any>} The answer
   */
  async question(question) {
    return exports.Ask.question(question);
  }
  /**
   * Asks multiple questions
   *
   * @param {IQuestion[]} questions - The questions to ask
   * @returns {Promise<Record<string, any>>} The answers
   */
  async questions(questions) {
    return exports.Ask.questions(questions);
  }
  /**
   * Asks for input
   *
   * @param {string} message - The message to display
   * @param {string} defaultValue - The default value
   * @returns {Promise<string>} The input
   */
  async input(message, defaultValue) {
    return exports.Ask.input(message, defaultValue);
  }
  /**
   * Asks for confirmation
   *
   * @param {string} message - The message to display
   * @param {boolean} defaultValue - The default value
   * @returns {Promise<boolean>} The confirmation
   */
  async confirm(message, defaultValue = false) {
    return exports.Ask.confirm(message, defaultValue);
  }
  /**
   * Asks for a selection from a list
   *
   * @param {string} message - The message to display
   * @param {string[] | { name: string; value: any }[]} choices - The choices
   * @param {any} defaultValue - The default value
   * @returns {Promise<any>} The selection
   */
  async select(message, choices, defaultValue) {
    return exports.Ask.select(message, choices, defaultValue);
  }
  /**
   * Asks for multiple selections from a list
   *
   * @param {string} message - The message to display
   * @param {string[] | { name: string; value: any }[]} choices - The choices
   * @param {any[]} defaultValue - The default values
   * @returns {Promise<any[]>} The selections
   */
  async multiSelect(message, choices, defaultValue) {
    return exports.Ask.multiSelect(message, choices, defaultValue);
  }
  /**
   * Asks for a password
   *
   * @param {string} message - The message to display
   * @returns {Promise<string>} The password
   */
  async password(message) {
    return exports.Ask.password(message);
  }
  /**
   * Asks a single question
   *
   * @param {IQuestion} question - The question to ask
   * @returns {Promise<any>} The answer
   */
  static async question(question) {
    const answers = await inquirer__default.default.prompt([question]);
    return answers[question.name];
  }
  /**
   * Asks multiple questions
   *
   * @param {IQuestion[]} questions - The questions to ask
   * @returns {Promise<Record<string, any>>} The answers
   */
  static async questions(questions) {
    return inquirer__default.default.prompt(questions);
  }
  /**
   * Asks for input
   *
   * @param {string} message - The message to display
   * @param {string} defaultValue - The default value
   * @returns {Promise<string>} The input
   */
  static async input(message, defaultValue) {
    return exports.Ask.question({
      type: tsTypes.QuestionType.Input,
      name: "input",
      message,
      default: defaultValue
    });
  }
  /**
   * Asks for confirmation
   *
   * @param {string} message - The message to display
   * @param {boolean} defaultValue - The default value
   * @returns {Promise<boolean>} The confirmation
   */
  static async confirm(message, defaultValue = false) {
    return exports.Ask.question({
      type: tsTypes.QuestionType.Confirm,
      name: "confirm",
      message,
      default: defaultValue
    });
  }
  /**
   * Asks for a selection from a list
   *
   * @param {string} message - The message to display
   * @param {string[] | { name: string; value: any }[]} choices - The choices
   * @param {any} defaultValue - The default value
   * @returns {Promise<any>} The selection
   */
  static async select(message, choices, defaultValue) {
    return exports.Ask.question({
      type: tsTypes.QuestionType.List,
      name: "select",
      message,
      choices,
      default: defaultValue
    });
  }
  /**
   * Asks for multiple selections from a list
   *
   * @param {string} message - The message to display
   * @param {string[] | { name: string; value: any }[]} choices - The choices
   * @param {any[]} defaultValue - The default values
   * @returns {Promise<any[]>} The selections
   */
  static async multiSelect(message, choices, defaultValue) {
    return exports.Ask.question({
      type: tsTypes.QuestionType.Checkbox,
      name: "multiSelect",
      message,
      choices,
      default: defaultValue
    });
  }
  /**
   * Asks for a password
   *
   * @param {string} message - The message to display
   * @returns {Promise<string>} The password
   */
  static async password(message) {
    return exports.Ask.question({
      type: tsTypes.QuestionType.Password,
      name: "password",
      message
    });
  }
};
exports.Ask = __decorateClass([
  inversify.injectable()
], exports.Ask);
exports.TableOutput = class TableOutput {
  /**
   * Creates a new TableOutput instance
   *
   * @param {string[]} headers - The table headers
   * @param {ITableStyle} style - The table style
   */
  constructor(headers = [], style) {
    this.table = new Table__default.default({
      head: headers,
      ...style
    });
  }
  /**
   * Adds a row to the table
   *
   * @param {any[]} row - The row data
   * @returns {TableOutput} The table instance for chaining
   */
  addRow(row) {
    this.table.push(row);
    return this;
  }
  /**
   * Adds multiple rows to the table
   *
   * @param {any[][]} rows - The rows data
   * @returns {TableOutput} The table instance for chaining
   */
  addRows(rows) {
    rows.forEach((row) => this.addRow(row));
    return this;
  }
  /**
   * Renders the table to a string
   *
   * @returns {string} The rendered table
   */
  toString() {
    return this.table.toString();
  }
  /**
   * Renders the table to the console
   */
  render() {
    console.log(this.toString());
  }
  /**
   * Creates a new table from an array of objects
   *
   * @param {Record<string, any>[]} data - The data
   * @param {string[]} columns - The columns to include
   * @param {ITableStyle} style - The table style
   * @returns {TableOutput} The table instance
   */
  static fromObjects(data, columns, style) {
    const headers = columns;
    const table = new exports.TableOutput(headers, style);
    data.forEach((item) => {
      const row = columns.map((column) => {
        var _a;
        return (_a = item[column]) != null ? _a : "";
      });
      table.addRow(row);
    });
    return table;
  }
};
exports.TableOutput = __decorateClass([
  inversify.injectable()
], exports.TableOutput);
exports.ProgressBar = class ProgressBar {
  /**
   * Creates a new ProgressBar instance
   *
   * @param {number} total - The total value
   * @param {IProgressBarFormat} format - The format options
   */
  constructor(total = 100, format) {
    this.bar = new cliProgress__default.default.SingleBar({
      format: (format == null ? void 0 : format.format) || `${chalk6__default.default.cyan("{bar}")} {percentage}% | ETA: {eta}s | {value}/{total}`,
      barCompleteChar: (format == null ? void 0 : format.barCompleteChar) || "\u2588",
      barIncompleteChar: (format == null ? void 0 : format.barIncompleteChar) || "\u2591"
    });
    this.bar.start(total, 0);
  }
  /**
   * Updates the progress bar
   *
   * @param {number} value - The current value
   * @param {Record<string, any>} payload - Additional payload data
   */
  update(value, payload) {
    this.bar.update(value, payload);
  }
  /**
   * Increments the progress bar
   *
   * @param {number} value - The value to increment by
   * @param {Record<string, any>} payload - Additional payload data
   */
  increment(value = 1, payload) {
    this.bar.increment(value, payload);
  }
  /**
   * Stops the progress bar
   */
  stop() {
    this.bar.stop();
  }
  /**
   * Creates a multi-bar container
   *
   * @returns {cliProgress.MultiBar} The multi-bar container
   */
  static createMultiBar() {
    return new cliProgress__default.default.MultiBar({
      format: `${chalk6__default.default.cyan("{bar}")} {percentage}% | ETA: {eta}s | {value}/{total}`,
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591"
    });
  }
};
exports.ProgressBar = __decorateClass([
  inversify.injectable()
], exports.ProgressBar);

// src/commands/demo-command.ts
exports.DemoCommand = class DemoCommand extends BaseCommand {
  /**
   * Executes the command
   *
   * @returns {Promise<number>} The exit code
   */
  async execute() {
    try {
      const feature = this.input.getOption("feature") || this.feature;
      if (!feature) {
        const selectedFeature = await exports.Ask.select("Which feature would you like to see?", [
          { name: "Interactive prompts", value: "ask" },
          { name: "Tables", value: "table" },
          { name: "Progress bars", value: "progress" },
          { name: "All features", value: "all" }
        ]);
        if (selectedFeature === "all") {
          await this.demoAsk();
          await this.demoTable();
          await this.demoProgress();
        } else if (selectedFeature === "ask") {
          await this.demoAsk();
        } else if (selectedFeature === "table") {
          await this.demoTable();
        } else if (selectedFeature === "progress") {
          await this.demoProgress();
        }
      } else {
        if (feature === "ask") {
          await this.demoAsk();
        } else if (feature === "table") {
          await this.demoTable();
        } else if (feature === "progress") {
          await this.demoProgress();
        } else {
          this.error(`Unknown feature: ${feature}`);
          return BaseCommand.FAILURE;
        }
      }
      return BaseCommand.SUCCESS;
    } catch (error) {
      this.error(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
      return BaseCommand.FAILURE;
    }
  }
  /**
   * Demonstrates the Ask utility
   *
   * @private
   */
  async demoAsk() {
    this.info("Demonstrating interactive prompts...");
    const name = await exports.Ask.input("What's your name?");
    const age = await exports.Ask.question({
      type: tsTypes.QuestionType.Number,
      name: "age",
      message: "How old are you?",
      validate: (input) => {
        if (isNaN(input) || input < 0) {
          return "Please enter a valid age";
        }
        return true;
      }
    });
    const likesCli = await exports.Ask.confirm("Do you like CLI tools?");
    const favoriteColor = await exports.Ask.select("What's your favorite color?", [
      "Red",
      "Green",
      "Blue",
      "Yellow",
      "Other"
    ]);
    const languages = await exports.Ask.multiSelect("Which programming languages do you know?", [
      "JavaScript",
      "TypeScript",
      "PHP",
      "Python",
      "Ruby",
      "Go",
      "Java",
      "C#"
    ]);
    this.line();
    this.success("Survey complete!");
    this.line();
    this.line(`Name: ${chalk6__default.default.cyan(name)}`);
    this.line(`Age: ${chalk6__default.default.cyan(age)}`);
    this.line(`Likes CLI: ${likesCli ? chalk6__default.default.green("Yes") : chalk6__default.default.red("No")}`);
    this.line(`Favorite color: ${chalk6__default.default.cyan(favoriteColor)}`);
    this.line(`Languages: ${languages.map((l) => chalk6__default.default.cyan(l)).join(", ")}`);
    this.line();
  }
  /**
   * Demonstrates the TableOutput utility
   *
   * @private
   */
  async demoTable() {
    this.info("Demonstrating tables...");
    const table = new exports.TableOutput(["ID", "Name", "Email", "Role"]);
    table.addRows([
      [1, "John Doe", "john@example.com", "Admin"],
      [2, "Jane Smith", "jane@example.com", "User"],
      [3, "Bob Johnson", "bob@example.com", "Editor"]
    ]);
    this.line();
    table.render();
    this.line();
    const users = [
      { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", active: true },
      { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", active: false },
      { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Editor", active: true }
    ];
    const objectTable = exports.TableOutput.fromObjects(users, ["id", "name", "email", "role"], {
      style: {
        head: ["cyan"],
        border: ["gray"]
      }
    });
    this.line();
    objectTable.render();
    this.line();
  }
  /**
   * Demonstrates the ProgressBar utility
   *
   * @private
   */
  async demoProgress() {
    this.info("Demonstrating progress bars...");
    const total = 100;
    const bar = new exports.ProgressBar(total);
    for (let i = 0; i <= total; i++) {
      bar.update(i);
      await this.sleep(20);
    }
    bar.stop();
    this.line();
    this.info("Demonstrating multiple progress bars...");
    const multiBar = exports.ProgressBar.createMultiBar();
    const bar1 = multiBar.create(100, 0, { task: "Task 1" });
    const bar2 = multiBar.create(100, 0, { task: "Task 2" });
    const bar3 = multiBar.create(100, 0, { task: "Task 3" });
    for (let i = 0; i <= 100; i++) {
      bar1.update(i, { task: "Task 1" });
      if (i >= 30) {
        bar2.update(Math.min(Math.floor((i - 30) * 1.5), 100), { task: "Task 2" });
      }
      if (i >= 60) {
        bar3.update(Math.min(Math.floor((i - 60) * 2.5), 100), { task: "Task 3" });
      }
      await this.sleep(30);
    }
    multiBar.stop();
    this.line();
    this.success("Progress bar demonstration complete!");
  }
  /**
   * Sleeps for the specified number of milliseconds
   *
   * @param {number} ms - The number of milliseconds to sleep
   * @returns {Promise<void>} A promise that resolves after the specified time
   * @private
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};
__decorateClass([
  Option({
    flags: "-f, --feature <feature>",
    description: "The feature to demonstrate (ask, table, progress)"
  })
], exports.DemoCommand.prototype, "feature", 2);
exports.DemoCommand = __decorateClass([
  Command({
    name: "demo",
    description: "Demonstrate UI features",
    shortcuts: [
      {
        flag: "-d",
        description: "Demonstrate UI features"
      }
    ]
  })
], exports.DemoCommand);
exports.GreetCommand = class GreetCommand extends BaseCommand {
  /**
   * Executes the command
   *
   * @returns {Promise<number>} The exit code
   */
  async execute() {
    try {
      const name = this.input.getArgument("0") || "World";
      const uppercase = this.input.getOption("uppercase") === true || this.uppercase || false;
      const color = this.input.getOption("color") || this.color || "green";
      let greeting = `Hello, ${name}!`;
      if (uppercase) {
        greeting = greeting.toUpperCase();
      }
      let coloredGreeting;
      switch (color) {
        case "red":
          coloredGreeting = chalk6__default.default.red(greeting);
          break;
        case "green":
          coloredGreeting = chalk6__default.default.green(greeting);
          break;
        case "blue":
          coloredGreeting = chalk6__default.default.blue(greeting);
          break;
        case "yellow":
          coloredGreeting = chalk6__default.default.yellow(greeting);
          break;
        case "cyan":
          coloredGreeting = chalk6__default.default.cyan(greeting);
          break;
        default:
          coloredGreeting = chalk6__default.default.green(greeting);
      }
      this.line();
      this.line(coloredGreeting);
      this.line();
      return BaseCommand.SUCCESS;
    } catch (error) {
      this.error(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
      return BaseCommand.FAILURE;
    }
  }
};
__decorateClass([
  Option({
    flags: "-u, --uppercase",
    description: "Convert the greeting to uppercase"
  })
], exports.GreetCommand.prototype, "uppercase", 2);
__decorateClass([
  Option({
    flags: "-c, --color <color>",
    description: "The color of the greeting (red, green, blue, yellow, cyan)",
    defaultValue: "green"
  })
], exports.GreetCommand.prototype, "color", 2);
exports.GreetCommand = __decorateClass([
  Command({
    name: "greet",
    description: "Greet the user",
    shortcuts: [
      {
        flag: "-g",
        description: "Greet the user"
      }
    ]
  })
], exports.GreetCommand);
exports.HelpCommand = class HelpCommand extends BaseCommand {
  /**
   * Creates a new HelpCommand instance
   *
   * @param {ICommandRegistry} registry - The command registry
   */
  constructor(registry) {
    super("help", "Display help for a command");
    this.registry = registry;
  }
  /**
   * Executes the command
   *
   * @returns {Promise<number>} The exit code
   */
  async execute() {
    try {
      const commandName = this.input.getArgument("0");
      if (!commandName) {
        this.error("Command name is required.");
        this.line("");
        this.line("Usage: help <command>");
        return BaseCommand.INVALID;
      }
      const command = this.registry.get(commandName);
      if (!command) {
        this.error(`Command "${commandName}" not found.`);
        return BaseCommand.FAILURE;
      }
      const metadata = Reflect.getMetadata(COMMAND_METADATA_KEY, command.constructor) || {};
      this.line(chalk6__default.default.bold(`${command.getName()}: ${command.getDescription()}`));
      this.line("");
      if (metadata.aliases && metadata.aliases.length > 0) {
        this.line(chalk6__default.default.cyan("Aliases:"));
        metadata.aliases.forEach((alias) => {
          this.line(`  ${chalk6__default.default.yellow(alias)}`);
        });
        this.line("");
      }
      if (metadata.shortcuts && metadata.shortcuts.length > 0) {
        this.line(chalk6__default.default.cyan("Shortcuts:"));
        metadata.shortcuts.forEach((shortcut) => {
          this.line(`  ${chalk6__default.default.magenta(shortcut.flag)}: ${shortcut.description}`);
        });
        this.line("");
      }
      const argumentsMetadata = Reflect.getMetadata(ARGUMENT_METADATA_KEY, command.constructor) || [];
      if (argumentsMetadata.length > 0) {
        this.line(chalk6__default.default.cyan("Arguments:"));
        argumentsMetadata.forEach((arg) => {
          this.line(`  ${chalk6__default.default.green(arg.name)}: ${arg.description || "No description"}`);
        });
        this.line("");
      }
      const optionsMetadata = Reflect.getMetadata(OPTION_METADATA_KEY, command.constructor) || [];
      if (optionsMetadata.length > 0) {
        this.line(chalk6__default.default.cyan("Options:"));
        optionsMetadata.forEach((opt) => {
          this.line(`  ${chalk6__default.default.green(opt.flags)}: ${opt.description || "No description"}`);
        });
        this.line("");
      }
      return BaseCommand.SUCCESS;
    } catch (error) {
      this.error(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
      return BaseCommand.FAILURE;
    }
  }
};
exports.HelpCommand = __decorateClass([
  Command({
    name: "help",
    description: "Display help for a command",
    shortcuts: [
      {
        flag: "-h, --help-cmd <command>",
        description: "Display help for a specific command"
      }
    ]
  }),
  __decorateParam(0, inversify.inject(tsTypes.ICommandRegistry.$))
], exports.HelpCommand);
exports.ListCommand = class ListCommand extends BaseCommand {
  /**
   * Creates a new ListCommand instance
   *
   * @param {ICommandRegistry} registry - The command registry
   */
  constructor(registry) {
    super();
    this.registry = registry;
  }
  /**
   * Executes the command
   *
   * @returns {Promise<number>} The exit code
   */
  async execute() {
    try {
      const commands = this.registry.getAll();
      this.line(chalk6__default.default.bold("Available commands:"));
      this.line(chalk6__default.default.dim("Use command name, alias, or shortcut to run a command"));
      this.line("");
      if (commands.length === 0) {
        this.line("  No commands registered.");
        return BaseCommand.SUCCESS;
      }
      const commandGroups = {};
      commands.forEach((command) => {
        const name = command.getName();
        const category = name.includes(":") ? name.split(":")[0] : "general";
        if (!commandGroups[category]) {
          commandGroups[category] = [];
        }
        commandGroups[category].push(command);
      });
      for (const [category, groupCommands] of Object.entries(commandGroups)) {
        this.line(chalk6__default.default.cyan(`${category.charAt(0).toUpperCase() + category.slice(1)} Commands:`));
        const table = new exports.TableOutput(["Command", "Aliases", "Shortcuts", "Description"]);
        groupCommands.sort((a, b) => a.getName().localeCompare(b.getName()));
        groupCommands.forEach((command) => {
          const metadata = Reflect.getMetadata(COMMAND_METADATA_KEY, command.constructor) || {};
          const aliases = metadata.aliases ? metadata.aliases.join(", ") : "";
          let shortcuts = "";
          if (metadata.shortcuts && metadata.shortcuts.length > 0) {
            shortcuts = metadata.shortcuts.map((s) => {
              const shortFlag = s.flag.split(",")[0].trim();
              return shortFlag;
            }).join(", ");
          }
          if (metadata.hidden) {
            return;
          }
          table.addRow([
            chalk6__default.default.green(command.getName()),
            aliases ? chalk6__default.default.yellow(aliases) : "",
            shortcuts ? chalk6__default.default.magenta(shortcuts) : "",
            command.getDescription()
          ]);
        });
        table.render();
        this.line("");
      }
      return BaseCommand.SUCCESS;
    } catch (error) {
      this.error(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
      return BaseCommand.FAILURE;
    }
  }
};
exports.ListCommand = __decorateClass([
  Command({
    name: "list",
    description: "List all available commands",
    aliases: ["commands"],
    shortcuts: [
      {
        flag: "-l, --list",
        description: "List all available commands"
      }
    ]
  }),
  __decorateParam(0, inversify.inject(tsTypes.ICommandRegistry.$))
], exports.ListCommand);
exports.MakeCommand = class MakeCommand extends BaseCommand {
  /**
   * Creates a new MakeCommand instance
   * @param {IStubGenerator} stubGenerator - The stub generator
   */
  constructor(stubGenerator) {
    super();
    this.stubGenerator = stubGenerator;
  }
  /**
   * Executes the command
   * @returns {Promise<number>} The exit code
   */
  async execute() {
    try {
      const name = this.input.getArgument("0") || this.commandName;
      if (!name) {
        const inputName = await exports.Ask.input("What should the command be named?");
        if (!inputName) {
          this.error("Command name is required.");
          return BaseCommand.INVALID;
        }
        this.commandName = inputName;
      } else {
        this.commandName = name;
      }
      let description = this.input.getOption("description") || this.commandDescription;
      if (!description) {
        description = await exports.Ask.input(
          "Enter a description for the command:",
          "A custom console command"
        );
        this.commandDescription = description;
      }
      const className = this.getClassName(this.commandName);
      const outputDir = this.input.getOption("dir") || this.directory;
      const outputPath = path2__namespace.join(
        process.cwd(),
        outputDir,
        `${this.getFileName(this.commandName)}.ts`
      );
      if (fs2__namespace.existsSync(outputPath)) {
        const overwrite = await exports.Ask.confirm(`File ${outputPath} already exists. Overwrite?`, false);
        if (!overwrite) {
          this.info("Command creation cancelled.");
          return BaseCommand.SUCCESS;
        }
      }
      const success = this.stubGenerator.generate("command", outputPath, {
        name: this.commandName,
        className,
        commandName: this.commandName,
        description
      });
      if (success) {
        this.success(
          `Command ${chalk6__default.default.green(this.commandName)} created successfully at ${chalk6__default.default.cyan(outputPath)}`
        );
        return BaseCommand.SUCCESS;
      } else {
        this.error(`Failed to create command ${this.commandName}`);
        return BaseCommand.FAILURE;
      }
    } catch (error) {
      this.error(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
      return BaseCommand.FAILURE;
    }
  }
  /**
   * Converts a command name to a class name
   *
   * @param {string} name - The command name
   * @returns {string} The class name
   * @private
   */
  getClassName(name) {
    return name.split(":").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("") + "Command";
  }
  /**
   * Converts a command name to a file name
   *
   * @param {string} name - The command name
   * @returns {string} The file name
   * @private
   */
  getFileName(name) {
    return name.replace(":", "-") + "-command";
  }
};
__decorateClass([
  Argument({
    name: "name",
    description: "The name of the command (e.g., app:greet)",
    required: true
  })
], exports.MakeCommand.prototype, "commandName", 2);
__decorateClass([
  Option({
    flags: "-d, --dir <directory>",
    description: "The directory where the command will be created",
    defaultValue: "src/commands"
  })
], exports.MakeCommand.prototype, "directory", 2);
__decorateClass([
  Option({
    flags: "--description <description>",
    description: "The description of the command"
  })
], exports.MakeCommand.prototype, "commandDescription", 2);
exports.MakeCommand = __decorateClass([
  Command({
    name: "make:command",
    description: "Create a new console command"
  }),
  __decorateParam(0, inversify.inject(tsTypes.IStubGenerator.$))
], exports.MakeCommand);
exports.ScheduleCommand = class ScheduleCommand extends BaseCommand {
  /**
   * Creates a new ScheduleCommand instance
   *
   * @param {ICommandScheduler} scheduler - The command scheduler
   */
  constructor(scheduler) {
    super();
    this.scheduler = scheduler;
  }
  /**
   * Executes the command
   *
   * @returns {Promise<number>} The exit code
   */
  async execute() {
    try {
      const action = this.input.getArgument("0") || this.action;
      switch (action) {
        case "list":
          return this.listTasks();
        case "start":
          return this.startScheduler();
        case "stop":
          return this.stopScheduler();
        default:
          this.error(`Unknown action: ${action}`);
          this.line("Available actions: list, start, stop");
          return BaseCommand.INVALID;
      }
    } catch (error) {
      this.error(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
      return BaseCommand.FAILURE;
    }
  }
  /**
   * Lists all scheduled tasks
   *
   * @returns {Promise<number>} The exit code
   * @private
   */
  async listTasks() {
    const tasks = this.scheduler.getTasks();
    if (tasks.length === 0) {
      this.info("No scheduled tasks.");
      return BaseCommand.SUCCESS;
    }
    const table = new exports.TableOutput(["Command", "Schedule", "Last Run", "Next Run"]);
    tasks.forEach((task) => {
      const expression = this.formatExpression(task.expression);
      const lastRun = task.lastRun ? task.lastRun.toLocaleString() : "Never";
      const nextRun = task.nextRun ? task.nextRun.toLocaleString() : "Unknown";
      table.addRow([task.command.getName(), expression, lastRun, nextRun]);
    });
    this.line();
    table.render();
    this.line();
    return BaseCommand.SUCCESS;
  }
  /**
   * Starts the scheduler
   *
   * @returns {Promise<number>} The exit code
   * @private
   */
  async startScheduler() {
    this.scheduler.start();
    this.success("Scheduler started.");
    return BaseCommand.SUCCESS;
  }
  /**
   * Stops the scheduler
   *
   * @returns {Promise<number>} The exit code
   * @private
   */
  async stopScheduler() {
    this.scheduler.stop();
    this.success("Scheduler stopped.");
    return BaseCommand.SUCCESS;
  }
  /**
   * Formats a schedule expression
   *
   * @param {any} expression - The schedule expression
   * @returns {string} The formatted expression
   * @private
   */
  formatExpression(expression) {
    var _a, _b, _c, _d, _e;
    const minute = (_a = expression.minute) != null ? _a : "*";
    const hour = (_b = expression.hour) != null ? _b : "*";
    const dayOfMonth = (_c = expression.dayOfMonth) != null ? _c : "*";
    const month = (_d = expression.month) != null ? _d : "*";
    const dayOfWeek = (_e = expression.dayOfWeek) != null ? _e : "*";
    return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
  }
};
__decorateClass([
  Argument({
    name: "action",
    description: "The action to perform (list, run, start, stop)",
    required: true
  })
], exports.ScheduleCommand.prototype, "action", 2);
exports.ScheduleCommand = __decorateClass([
  Command({
    name: "schedule",
    description: "Manage scheduled tasks"
  }),
  __decorateParam(0, inversify.inject(tsTypes.ICommandScheduler.$))
], exports.ScheduleCommand);
exports.StubGenerator = class StubGenerator {
  /**
   * Creates a new StubGenerator instance
   *
   * @param {string} stubsDir - The directory containing the stub templates
   */
  constructor(stubsDir) {
    this.stubsDir = stubsDir;
  }
  /**
   * Generates a file from a stub template
   *
   * @param {string} stubName - The name of the stub template
   * @param {string} outputPath - The path where the generated file will be saved
   * @param {Record<string, string>} replacements - Map of placeholders to their replacements
   * @returns {boolean} True if the file was generated successfully, false otherwise
   */
  generate(stubName, outputPath, replacements) {
    try {
      const stubPath = path2__namespace.join(this.stubsDir, `${stubName}.stub`);
      if (!fs2__namespace.existsSync(stubPath)) {
        throw new Error(`Stub template "${stubName}" not found.`);
      }
      let content = fs2__namespace.readFileSync(stubPath, "utf8");
      for (const [placeholder, value] of Object.entries(replacements)) {
        content = content.replace(new RegExp(`\\{\\{${placeholder}\\}\\}`, "g"), value);
      }
      const dir = path2__namespace.dirname(outputPath);
      if (!fs2__namespace.existsSync(dir)) {
        fs2__namespace.mkdirSync(dir, { recursive: true });
      }
      fs2__namespace.writeFileSync(outputPath, content);
      return true;
    } catch (error) {
      console.error(
        `Error generating file: ${error instanceof Error ? error.message : String(error)}`
      );
      return false;
    }
  }
  /**
   * Gets the list of available stub templates
   *
   * @returns {string[]} Array of stub template names
   */
  getAvailableStubs() {
    try {
      return fs2__namespace.readdirSync(this.stubsDir).filter((file) => file.endsWith(".stub")).map((file) => file.replace(".stub", ""));
    } catch (error) {
      console.error(
        `Error getting available stubs: ${error instanceof Error ? error.message : String(error)}`
      );
      return [];
    }
  }
};
exports.StubGenerator = __decorateClass([
  inversify.injectable()
], exports.StubGenerator);
var INJECTABLE_METADATA_KEY = Symbol("injectable");
function Injectable() {
  return (target) => {
    const paramTypes = Reflect.getMetadata("design:paramtypes", target) || [];
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, paramTypes, target);
  };
}
exports.CommandCollector = class CommandCollector {
  /**
   * Discovers commands in the specified directory
   *
   * @param {string} directory - The directory to scan for commands
   * @param {string} pattern - The glob pattern to match command files
   * @returns {Promise<ICommand[]>} The discovered commands
   */
  async discoverCommands(directory, pattern = "**/*-command.{ts,js}") {
    return exports.CommandCollector.discoverCommands(directory, pattern);
  }
  /**
   * Gets all commands that have been registered with the container
   *
   * @returns {ICommand[]} The registered commands
   */
  getRegisteredCommands() {
    return exports.CommandCollector.getRegisteredCommands();
  }
  /**
   * Gets command metadata for a command class
   *
   * @param {Function} commandClass - The command class
   * @returns {any} The command metadata
   */
  getCommandMetadata(commandClass) {
    return exports.CommandCollector.getCommandMetadata(commandClass);
  }
  /**
   * Discovers commands in the specified directory
   *
   * @param {string} directory - The directory to scan for commands
   * @param {string} pattern - The glob pattern to match command files
   * @returns {Promise<ICommand[]>} The discovered commands
   */
  static async discoverCommands(directory, pattern = "**/*-command.{ts,js}") {
    try {
      const absolutePath = path2__namespace.isAbsolute(directory) ? directory : path2__namespace.join(process.cwd(), directory);
      const files = await glob.glob(pattern, {
        cwd: absolutePath,
        absolute: true
      });
      for (const file of files) {
        try {
          __require(file);
        } catch (error) {
          console.error(`Error importing command file ${file}:`, error);
        }
      }
      return container.getAll(tsTypes.ICommand.$);
    } catch (error) {
      console.error("Error discovering commands:", error);
      return [];
    }
  }
  /**
   * Gets all commands that have been registered with the container
   *
   * @returns {ICommand[]} The registered commands
   */
  static getRegisteredCommands() {
    return container.getAll(tsTypes.ICommand.$);
  }
  /**
   * Gets command metadata for a command class
   *
   * @param {Function} commandClass - The command class
   * @returns {any} The command metadata
   */
  static getCommandMetadata(commandClass) {
    return Reflect.getMetadata(COMMAND_METADATA_KEY, commandClass);
  }
};
exports.CommandCollector = __decorateClass([
  inversify.injectable()
], exports.CommandCollector);

exports.ARGUMENT_METADATA_KEY = ARGUMENT_METADATA_KEY;
exports.Argument = Argument;
exports.BaseCommand = BaseCommand;
exports.COMMAND_METADATA_KEY = COMMAND_METADATA_KEY;
exports.Command = Command;
exports.INJECTABLE_METADATA_KEY = INJECTABLE_METADATA_KEY;
exports.Injectable = Injectable;
exports.Input = Input;
exports.OPTION_METADATA_KEY = OPTION_METADATA_KEY;
exports.Option = Option;
exports.Output = Output;
exports.container = container;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map