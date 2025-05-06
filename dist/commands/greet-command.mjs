import chalk3 from 'chalk';
import 'reflect-metadata';
import { Container, injectable } from 'inversify';
import { QuestionType, ICommand } from '@pixielity/ts-types';
import inquirer from 'inquirer';
import cliProgress from 'cli-progress';
import Table from 'cli-table3';

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
    console.error(chalk3.bold.red("ERROR") + ": " + message);
  }
  /**
   * Writes a success message to the output
   *
   * @param {string} message - The success message to write
   */
  success(message) {
    console.log(chalk3.bold.green("SUCCESS") + ": " + message);
  }
  /**
   * Writes an info message to the output
   *
   * @param {string} message - The info message to write
   */
  info(message) {
    console.log(chalk3.bold.blue("INFO") + ": " + message);
  }
  /**
   * Writes a warning message to the output
   *
   * @param {string} message - The warning message to write
   */
  warning(message) {
    console.log(chalk3.bold.yellow("WARNING") + ": " + message);
  }
  /**
   * Writes a comment message to the output
   *
   * @param {string} message - The comment message to write
   */
  comment(message) {
    console.log(chalk3.gray("// " + message));
  }
};
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
var Ask = class {
  /**
   * Asks a single question
   *
   * @param {IQuestion} question - The question to ask
   * @returns {Promise<any>} The answer
   */
  async question(question) {
    return Ask.question(question);
  }
  /**
   * Asks multiple questions
   *
   * @param {IQuestion[]} questions - The questions to ask
   * @returns {Promise<Record<string, any>>} The answers
   */
  async questions(questions) {
    return Ask.questions(questions);
  }
  /**
   * Asks for input
   *
   * @param {string} message - The message to display
   * @param {string} defaultValue - The default value
   * @returns {Promise<string>} The input
   */
  async input(message, defaultValue) {
    return Ask.input(message, defaultValue);
  }
  /**
   * Asks for confirmation
   *
   * @param {string} message - The message to display
   * @param {boolean} defaultValue - The default value
   * @returns {Promise<boolean>} The confirmation
   */
  async confirm(message, defaultValue = false) {
    return Ask.confirm(message, defaultValue);
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
    return Ask.select(message, choices, defaultValue);
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
    return Ask.multiSelect(message, choices, defaultValue);
  }
  /**
   * Asks for a password
   *
   * @param {string} message - The message to display
   * @returns {Promise<string>} The password
   */
  async password(message) {
    return Ask.password(message);
  }
  /**
   * Asks a single question
   *
   * @param {IQuestion} question - The question to ask
   * @returns {Promise<any>} The answer
   */
  static async question(question) {
    const answers = await inquirer.prompt([question]);
    return answers[question.name];
  }
  /**
   * Asks multiple questions
   *
   * @param {IQuestion[]} questions - The questions to ask
   * @returns {Promise<Record<string, any>>} The answers
   */
  static async questions(questions) {
    return inquirer.prompt(questions);
  }
  /**
   * Asks for input
   *
   * @param {string} message - The message to display
   * @param {string} defaultValue - The default value
   * @returns {Promise<string>} The input
   */
  static async input(message, defaultValue) {
    return Ask.question({
      type: QuestionType.Input,
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
    return Ask.question({
      type: QuestionType.Confirm,
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
    return Ask.question({
      type: QuestionType.List,
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
    return Ask.question({
      type: QuestionType.Checkbox,
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
    return Ask.question({
      type: QuestionType.Password,
      name: "password",
      message
    });
  }
};
Ask = __decorateClass([
  injectable()
], Ask);
var ProgressBar = class {
  /**
   * Creates a new ProgressBar instance
   *
   * @param {number} total - The total value
   * @param {IProgressBarFormat} format - The format options
   */
  constructor(total = 100, format) {
    this.bar = new cliProgress.SingleBar({
      format: (format == null ? void 0 : format.format) || `${chalk3.cyan("{bar}")} {percentage}% | ETA: {eta}s | {value}/{total}`,
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
    return new cliProgress.MultiBar({
      format: `${chalk3.cyan("{bar}")} {percentage}% | ETA: {eta}s | {value}/{total}`,
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591"
    });
  }
};
ProgressBar = __decorateClass([
  injectable()
], ProgressBar);
var TableOutput = class {
  /**
   * Creates a new TableOutput instance
   *
   * @param {string[]} headers - The table headers
   * @param {ITableStyle} style - The table style
   */
  constructor(headers = [], style) {
    this.table = new Table({
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
    const table = new TableOutput(headers, style);
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
TableOutput = __decorateClass([
  injectable()
], TableOutput);

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
  /**
   * Ask utility class
   *
   * @param key - The option name.
   * @returns Ask utility class
   */
  ask(message) {
    return Ask;
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
var GreetCommand = class extends BaseCommand {
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
          coloredGreeting = chalk3.red(greeting);
          break;
        case "green":
          coloredGreeting = chalk3.green(greeting);
          break;
        case "blue":
          coloredGreeting = chalk3.blue(greeting);
          break;
        case "yellow":
          coloredGreeting = chalk3.yellow(greeting);
          break;
        case "cyan":
          coloredGreeting = chalk3.cyan(greeting);
          break;
        default:
          coloredGreeting = chalk3.green(greeting);
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
], GreetCommand.prototype, "uppercase", 2);
__decorateClass([
  Option({
    flags: "-c, --color <color>",
    description: "The color of the greeting (red, green, blue, yellow, cyan)",
    defaultValue: "green"
  })
], GreetCommand.prototype, "color", 2);
GreetCommand = __decorateClass([
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
], GreetCommand);

export { GreetCommand };
//# sourceMappingURL=greet-command.mjs.map
//# sourceMappingURL=greet-command.mjs.map