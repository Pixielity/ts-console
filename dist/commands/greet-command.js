'use strict';

var chalk2 = require('chalk');
require('reflect-metadata');
var inversify = require('inversify');
var tsTypes = require('@pixielity/ts-types');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var chalk2__default = /*#__PURE__*/_interopDefault(chalk2);

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
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

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
    console.error(chalk2__default.default.bold.red("ERROR") + ": " + message);
  }
  /**
   * Writes a success message to the output
   *
   * @param {string} message - The success message to write
   */
  success(message) {
    console.log(chalk2__default.default.bold.green("SUCCESS") + ": " + message);
  }
  /**
   * Writes an info message to the output
   *
   * @param {string} message - The info message to write
   */
  info(message) {
    console.log(chalk2__default.default.bold.blue("INFO") + ": " + message);
  }
  /**
   * Writes a warning message to the output
   *
   * @param {string} message - The warning message to write
   */
  warning(message) {
    console.log(chalk2__default.default.bold.yellow("WARNING") + ": " + message);
  }
  /**
   * Writes a comment message to the output
   *
   * @param {string} message - The comment message to write
   */
  comment(message) {
    console.log(chalk2__default.default.gray("// " + message));
  }
};
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
   * Creates a new BaseCommand instance
   *
   * @param {string} [name] - The name of the command (optional)
   * @param {string} [description] - The description of the command (optional)
   */
  constructor(name, description = "") {
    if (name === void 0 || name === null) {
      const metadata = Reflect.getMetadata(COMMAND_METADATA_KEY, this.constructor);
      if (metadata && metadata.name) {
        this.name = metadata.name;
        if (!description && metadata.description) {
          this.description = metadata.description;
        } else {
          this.description = description;
        }
      } else {
        throw new Error(
          `Command name is required. Either provide it in the constructor or use the @Command decorator.`
        );
      }
    } else {
      this.name = name;
      this.description = description;
    }
    this.input = new Input([]);
    this.output = new Output();
  }
  /**
   * Gets the name of the command
   *
   * @returns {string} The command name
   */
  getName() {
    return this.name;
  }
  /**
   * Gets the description of the command
   *
   * @returns {string} The command description
   */
  getDescription() {
    return this.description;
  }
  /**
   * Sets the input instance
   *
   * @param {IInput} input - The input instance
   */
  setInput(input) {
    this.input = input;
  }
  /**
   * Gets the input instance
   *
   * @returns {IInput} The input instance
   */
  getInput() {
    return this.input;
  }
  /**
   * Sets the output instance
   *
   * @param {IOutput} output - The output instance
   */
  setOutput(output) {
    this.output = output;
  }
  /**
   * Gets the output instance
   *
   * @returns {IOutput} The output instance
   */
  getOutput() {
    return this.output;
  }
  /**
   * Sets the command arguments
   *
   * @param {string[]} args - The command arguments
   */
  setArguments(args) {
    args.forEach((arg, index) => {
      this.input.args[index.toString()] = arg;
    });
  }
  /**
   * Sets the command options
   *
   * @param {Record<string, any>} options - The command options
   */
  setOptions(options) {
    Object.entries(options).forEach(([key, value]) => {
      this.input.opts[key] = value;
    });
  }
  /**
   * Configures the command with options and arguments
   *
   * This method should be overridden by subclasses to define
   * command-specific options and arguments.
   */
  configure() {
  }
  /**
   * Hook that runs before command execution
   *
   * @returns {Promise<boolean>} True if execution should continue, false to abort
   */
  async beforeExecute() {
    return true;
  }
  /**
   * Hook that runs after command execution
   *
   * @param {number | void} exitCode - The exit code from the command
   * @returns {Promise<void>}
   */
  async afterExecute(exitCode) {
  }
  /**
   * Writes a line to the output
   *
   * @param {string} message - The message to write
   */
  line(message = "") {
    this.output.writeln(message);
  }
  /**
   * Writes an info message to the output
   *
   * @param {string} message - The message to write
   */
  info(message) {
    this.output.info(message);
  }
  /**
   * Writes a success message to the output
   *
   * @param {string} message - The message to write
   */
  success(message) {
    this.output.success(message);
  }
  /**
   * Writes an error message to the output
   *
   * @param {string} message - The message to write
   */
  error(message) {
    this.output.error(message);
  }
  /**
   * Writes a warning message to the output
   *
   * @param {string} message - The message to write
   */
  warning(message) {
    this.output.warning(message);
  }
  /**
   * Writes a comment message to the output
   *
   * @param {string} message - The message to write
   */
  comment(message) {
    this.output.comment(message);
  }
};
/**
 * Success exit code (0)
 * @static
 */
BaseCommand.SUCCESS = 0;
/**
 * Failure exit code (1)
 * @static
 */
BaseCommand.FAILURE = 1;
/**
 * Invalid input exit code (2)
 * @static
 */
BaseCommand.INVALID = 2;
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
          coloredGreeting = chalk2__default.default.red(greeting);
          break;
        case "green":
          coloredGreeting = chalk2__default.default.green(greeting);
          break;
        case "blue":
          coloredGreeting = chalk2__default.default.blue(greeting);
          break;
        case "yellow":
          coloredGreeting = chalk2__default.default.yellow(greeting);
          break;
        case "cyan":
          coloredGreeting = chalk2__default.default.cyan(greeting);
          break;
        default:
          coloredGreeting = chalk2__default.default.green(greeting);
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
    description: "Greet the user"
  })
], exports.GreetCommand);
//# sourceMappingURL=greet-command.js.map
//# sourceMappingURL=greet-command.js.map