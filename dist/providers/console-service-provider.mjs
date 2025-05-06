import * as path from 'path';
import { injectable, inject, Container } from 'inversify';
import * as fs from 'fs';
import { ICommandRegistry, ICommandCollector, IConsoleApplication, ICommandScheduler, IStubGenerator, ITableOutput, IProgressBar, IAsk, QuestionType, ICommand } from '@pixielity/ts-types';
import chalk from 'chalk';
import 'reflect-metadata';
import { Command } from 'commander';
import Table from 'cli-table3';
import cliProgress from 'cli-progress';
import inquirer from 'inquirer';
import { glob } from 'glob';

/**
 * @pixielity/ts-console v1.0.0
 * 
 * Advanced console toolkit for Node.js applications
 * 
 * @license MIT
 * @copyright 2025 Your Name <your.email@example.com>
 */

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
      result = (decorator(result)) || result;
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
var CommandRegistry = class {
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
CommandRegistry = __decorateClass([
  injectable()
], CommandRegistry);
var StubGenerator = class {
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
      const stubPath = path.join(this.stubsDir, `${stubName}.stub`);
      if (!fs.existsSync(stubPath)) {
        throw new Error(`Stub template "${stubName}" not found.`);
      }
      let content = fs.readFileSync(stubPath, "utf8");
      for (const [placeholder, value] of Object.entries(replacements)) {
        content = content.replace(new RegExp(`\\{\\{${placeholder}\\}\\}`, "g"), value);
      }
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(outputPath, content);
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
      return fs.readdirSync(this.stubsDir).filter((file) => file.endsWith(".stub")).map((file) => file.replace(".stub", ""));
    } catch (error) {
      console.error(
        `Error getting available stubs: ${error instanceof Error ? error.message : String(error)}`
      );
      return [];
    }
  }
};
StubGenerator = __decorateClass([
  injectable()
], StubGenerator);
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

// src/scheduler/scheduler.ts
var CommandScheduler = class {
  /**
   * Creates a new CommandScheduler instance
   *
   * @param {ICommandRegistry} commandRegistry - The command registry
   */
  constructor(commandRegistry) {
    /**
     * The scheduled tasks
     * @private
     */
    this.tasks = [];
    this.commandRegistry = commandRegistry;
    this.output = new Output();
  }
  /**
   * Schedules a command to run at a specific interval
   *
   * @param {string} commandName - The name of the command
   * @param {IScheduleExpression} expression - The schedule expression
   * @param {string[]} args - The arguments to pass to the command
   * @param {Record<string, any>} options - The options to pass to the command
   * @returns {CommandScheduler} The scheduler instance for chaining
   */
  schedule(commandName, expression, args = [], options = {}) {
    const command = this.commandRegistry.get(commandName);
    if (!command) {
      throw new Error(`Command "${commandName}" not found.`);
    }
    this.tasks.push({
      command,
      args,
      options,
      expression,
      nextRun: this.calculateNextRun(expression)
    });
    return this;
  }
  /**
   * Starts the scheduler
   *
   * @param {number} interval - The interval in milliseconds to check for tasks to run
   * @returns {CommandScheduler} The scheduler instance for chaining
   */
  start(interval = 6e4) {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => this.tick(), interval);
    this.output.info("Scheduler started.");
    return this;
  }
  /**
   * Stops the scheduler
   *
   * @returns {CommandScheduler} The scheduler instance for chaining
   */
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = void 0;
      this.output.info("Scheduler stopped.");
    }
    return this;
  }
  /**
   * Gets all scheduled tasks
   *
   * @returns {IScheduledTask[]} The scheduled tasks
   */
  getTasks() {
    return [...this.tasks];
  }
  /**
   * Clears all scheduled tasks
   *
   * @returns {CommandScheduler} The scheduler instance for chaining
   */
  clearTasks() {
    this.tasks = [];
    return this;
  }
  /**
   * Runs a scheduled task
   *
   * @param {IScheduledTask} task - The task to run
   * @returns {Promise<void>}
   * @private
   */
  async runTask(task) {
    try {
      this.output.info(`Running scheduled command: ${task.command.getName()}`);
      task.command.setOutput(new Output());
      task.command.setArguments(task.args);
      task.command.setOptions(task.options);
      if (task.command.beforeExecute) {
        const shouldContinue = await task.command.beforeExecute();
        if (!shouldContinue) {
          this.output.warning(
            `Command ${task.command.getName()} execution aborted by beforeExecute hook.`
          );
          return;
        }
      }
      const exitCode = await task.command.execute();
      if (task.command.afterExecute) {
        await task.command.afterExecute(exitCode);
      }
      task.lastRun = /* @__PURE__ */ new Date();
      task.nextRun = this.calculateNextRun(task.expression);
      this.output.success(`Command ${task.command.getName()} executed successfully.`);
    } catch (error) {
      this.output.error(
        `Error running command ${task.command.getName()}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
  /**
   * Checks for tasks to run
   *
   * @returns {Promise<void>}
   * @private
   */
  async tick() {
    const now = /* @__PURE__ */ new Date();
    for (const task of this.tasks) {
      if (task.nextRun && task.nextRun <= now) {
        await this.runTask(task);
      }
    }
  }
  /**
   * Calculates the next run time for a schedule expression
   *
   * @param {IScheduleExpression} expression - The schedule expression
   * @returns {Date} The next run time
   * @private
   */
  calculateNextRun(expression) {
    const now = /* @__PURE__ */ new Date();
    const next = new Date(now);
    next.setSeconds(0);
    next.setMilliseconds(0);
    next.setMinutes(next.getMinutes() + 1);
    if (expression.minute !== void 0 && expression.minute !== "*") {
      const minute = Number(expression.minute);
      next.setMinutes(minute);
      if (next <= now) {
        next.setHours(next.getHours() + 1);
      }
    }
    if (expression.hour !== void 0 && expression.hour !== "*") {
      const hour = Number(expression.hour);
      next.setHours(hour);
      if (next <= now) {
        next.setDate(next.getDate() + 1);
      }
    }
    if (expression.dayOfMonth !== void 0 && expression.dayOfMonth !== "*") {
      const day = Number(expression.dayOfMonth);
      next.setDate(day);
      if (next <= now) {
        next.setMonth(next.getMonth() + 1);
      }
    }
    if (expression.month !== void 0 && expression.month !== "*") {
      const month = Number(expression.month) - 1;
      next.setMonth(month);
      if (next <= now) {
        next.setFullYear(next.getFullYear() + 1);
      }
    }
    if (expression.dayOfWeek !== void 0 && expression.dayOfWeek !== "*") {
      const dayOfWeek = Number(expression.dayOfWeek);
      const currentDayOfWeek = next.getDay();
      const daysToAdd = (dayOfWeek - currentDayOfWeek + 7) % 7;
      if (daysToAdd > 0) {
        next.setDate(next.getDate() + daysToAdd);
      } else if (next <= now) {
        next.setDate(next.getDate() + 7);
      }
    }
    return next;
  }
};
CommandScheduler = __decorateClass([
  injectable(),
  __decorateParam(0, inject(ICommandRegistry.$))
], CommandScheduler);
var ARGUMENT_METADATA_KEY = Symbol("argument");
var OPTION_METADATA_KEY = Symbol("option");
var container = new Container({
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
      format: (format == null ? void 0 : format.format) || `${chalk.cyan("{bar}")} {percentage}% | ETA: {eta}s | {value}/{total}`,
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
      format: `${chalk.cyan("{bar}")} {percentage}% | ETA: {eta}s | {value}/{total}`,
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591"
    });
  }
};
ProgressBar = __decorateClass([
  injectable()
], ProgressBar);
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
var CommandCollector = class {
  /**
   * Discovers commands in the specified directory
   *
   * @param {string} directory - The directory to scan for commands
   * @param {string} pattern - The glob pattern to match command files
   * @returns {Promise<ICommand[]>} The discovered commands
   */
  async discoverCommands(directory, pattern = "**/*-command.{ts,js}") {
    return CommandCollector.discoverCommands(directory, pattern);
  }
  /**
   * Gets all commands that have been registered with the container
   *
   * @returns {ICommand[]} The registered commands
   */
  getRegisteredCommands() {
    return CommandCollector.getRegisteredCommands();
  }
  /**
   * Gets command metadata for a command class
   *
   * @param {Function} commandClass - The command class
   * @returns {any} The command metadata
   */
  getCommandMetadata(commandClass) {
    return CommandCollector.getCommandMetadata(commandClass);
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
      const absolutePath = path.isAbsolute(directory) ? directory : path.join(process.cwd(), directory);
      const files = await glob(pattern, {
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
      return container.getAll(ICommand.$);
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
    return container.getAll(ICommand.$);
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
CommandCollector = __decorateClass([
  injectable()
], CommandCollector);

// src/providers/console-service-provider.ts
var ConsoleServiceProvider = class {
  /**
   * Creates a new ConsoleServiceProvider instance
   *
   * @param {IContainer} container - The IoC container
   * @param {string} commandsDir - The directory containing commands
   * @param {string} stubsDir - The directory containing stubs
   */
  constructor(container2, commandsDir = path.join(process.cwd(), "src/commands"), stubsDir = path.join(process.cwd(), "src/stubs/templates")) {
    /**
     * Flag to track if services have been registered
     * @private
     */
    this.registered = false;
    this.app = container2;
    this.stubsDir = stubsDir;
    this.commandsDir = commandsDir;
  }
  /**
   * Register console services with the container
   */
  register() {
    if (this.registered) {
      return;
    }
    this.bindIfNotBound(IConsoleApplication.$, Application);
    this.bindIfNotBound(ICommandRegistry.$, CommandRegistry);
    this.bindIfNotBound(ICommandScheduler.$, CommandScheduler);
    this.bindIfNotBound(IStubGenerator.$, StubGenerator, new StubGenerator(this.stubsDir));
    this.bindIfNotBound(ITableOutput.$, TableOutput, null, false);
    this.bindIfNotBound(IProgressBar.$, ProgressBar, null, false);
    this.bindIfNotBound(IAsk.$, null, Ask);
    this.bindIfNotBound(ICommandCollector.$, CommandCollector);
    this.registered = true;
  }
  /**
   * Helper method to bind an interface to an implementation if not already bound
   *
   * @param symbol - The interface symbol
   * @param constructor - The implementation constructor
   * @param constantValue - Optional constant value for toConstantValue bindings
   * @param singleton - Whether to use singleton scope (default: true)
   */
  bindIfNotBound(symbol, constructor, constantValue, singleton = true) {
    if (!this.app.isBound(symbol)) {
      if (constantValue) {
        this.app.bind(symbol).toConstantValue(constantValue);
      } else if (singleton) {
        this.app.bind(symbol).to(constructor).inSingletonScope();
      } else {
        this.app.bind(symbol).to(constructor);
      }
    }
  }
  /**
   * Bootstrap console services
   *
   * @returns {Promise<IConsoleApplication>} The application instance
   */
  async boot() {
    const app = this.app.make(IConsoleApplication.$);
    await app.discoverCommands(this.commandsDir);
    return app;
  }
};

export { ConsoleServiceProvider };
//# sourceMappingURL=console-service-provider.mjs.map
//# sourceMappingURL=console-service-provider.mjs.map