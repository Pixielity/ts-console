import chalk2 from 'chalk';
import { Container, inject, injectable } from 'inversify';
import { ICommandRegistry, ICommand } from '@pixielity/ts-types';
import 'reflect-metadata';

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
    console.error(chalk2.bold.red("ERROR") + ": " + message);
  }
  /**
   * Writes a success message to the output
   *
   * @param {string} message - The success message to write
   */
  success(message) {
    console.log(chalk2.bold.green("SUCCESS") + ": " + message);
  }
  /**
   * Writes an info message to the output
   *
   * @param {string} message - The info message to write
   */
  info(message) {
    console.log(chalk2.bold.blue("INFO") + ": " + message);
  }
  /**
   * Writes a warning message to the output
   *
   * @param {string} message - The warning message to write
   */
  warning(message) {
    console.log(chalk2.bold.yellow("WARNING") + ": " + message);
  }
  /**
   * Writes a comment message to the output
   *
   * @param {string} message - The comment message to write
   */
  comment(message) {
    console.log(chalk2.gray("// " + message));
  }
};
var ARGUMENT_METADATA_KEY = Symbol("argument");
var container = new Container({
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
      injectable()(target);
      try {
        container.bind(ICommand.$).to(target).inSingletonScope();
      } catch (error) {
      }
    }
  };
}
var OPTION_METADATA_KEY = Symbol("option");

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

// src/commands/help-command.ts
var HelpCommand = class extends BaseCommand {
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
      this.line(chalk2.bold(`${command.getName()}: ${command.getDescription()}`));
      this.line("");
      if (metadata.aliases && metadata.aliases.length > 0) {
        this.line(chalk2.cyan("Aliases:"));
        metadata.aliases.forEach((alias) => {
          this.line(`  ${chalk2.yellow(alias)}`);
        });
        this.line("");
      }
      if (metadata.shortcuts && metadata.shortcuts.length > 0) {
        this.line(chalk2.cyan("Shortcuts:"));
        metadata.shortcuts.forEach((shortcut) => {
          this.line(`  ${chalk2.magenta(shortcut.flag)}: ${shortcut.description}`);
        });
        this.line("");
      }
      const argumentsMetadata = Reflect.getMetadata(ARGUMENT_METADATA_KEY, command.constructor) || [];
      if (argumentsMetadata.length > 0) {
        this.line(chalk2.cyan("Arguments:"));
        argumentsMetadata.forEach((arg) => {
          this.line(`  ${chalk2.green(arg.name)}: ${arg.description || "No description"}`);
        });
        this.line("");
      }
      const optionsMetadata = Reflect.getMetadata(OPTION_METADATA_KEY, command.constructor) || [];
      if (optionsMetadata.length > 0) {
        this.line(chalk2.cyan("Options:"));
        optionsMetadata.forEach((opt) => {
          this.line(`  ${chalk2.green(opt.flags)}: ${opt.description || "No description"}`);
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
HelpCommand = __decorateClass([
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
  __decorateParam(0, inject(ICommandRegistry.$))
], HelpCommand);

export { HelpCommand };
//# sourceMappingURL=help-command.mjs.map
//# sourceMappingURL=help-command.mjs.map