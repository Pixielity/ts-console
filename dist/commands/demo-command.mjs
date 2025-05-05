import chalk3 from 'chalk';
import { QuestionType, ICommand } from '@pixielity/ts-types';
import 'reflect-metadata';
import { Container, injectable } from 'inversify';
import inquirer from 'inquirer';
import Table from 'cli-table3';
import cliProgress from 'cli-progress';

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

// src/commands/demo-command.ts
var DemoCommand = class extends BaseCommand {
  /**
   * Executes the command
   *
   * @returns {Promise<number>} The exit code
   */
  async execute() {
    try {
      const feature = this.input.getOption("feature") || this.feature;
      if (!feature) {
        const selectedFeature = await Ask.select("Which feature would you like to see?", [
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
    const name = await Ask.input("What's your name?");
    const age = await Ask.question({
      type: QuestionType.Number,
      name: "age",
      message: "How old are you?",
      validate: (input) => {
        if (isNaN(input) || input < 0) {
          return "Please enter a valid age";
        }
        return true;
      }
    });
    const likesCli = await Ask.confirm("Do you like CLI tools?");
    const favoriteColor = await Ask.select("What's your favorite color?", [
      "Red",
      "Green",
      "Blue",
      "Yellow",
      "Other"
    ]);
    const languages = await Ask.multiSelect("Which programming languages do you know?", [
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
    this.line(`Name: ${chalk3.cyan(name)}`);
    this.line(`Age: ${chalk3.cyan(age)}`);
    this.line(`Likes CLI: ${likesCli ? chalk3.green("Yes") : chalk3.red("No")}`);
    this.line(`Favorite color: ${chalk3.cyan(favoriteColor)}`);
    this.line(`Languages: ${languages.map((l) => chalk3.cyan(l)).join(", ")}`);
    this.line();
  }
  /**
   * Demonstrates the TableOutput utility
   *
   * @private
   */
  async demoTable() {
    this.info("Demonstrating tables...");
    const table = new TableOutput(["ID", "Name", "Email", "Role"]);
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
    const objectTable = TableOutput.fromObjects(users, ["id", "name", "email", "role"], {
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
    const bar = new ProgressBar(total);
    for (let i = 0; i <= total; i++) {
      bar.update(i);
      await this.sleep(20);
    }
    bar.stop();
    this.line();
    this.info("Demonstrating multiple progress bars...");
    const multiBar = ProgressBar.createMultiBar();
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
], DemoCommand.prototype, "feature", 2);
DemoCommand = __decorateClass([
  Command({
    name: "demo",
    description: "Demonstrate UI features"
  })
], DemoCommand);

export { DemoCommand };
//# sourceMappingURL=demo-command.mjs.map
//# sourceMappingURL=demo-command.mjs.map