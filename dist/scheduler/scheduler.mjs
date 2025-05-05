import { injectable, inject } from 'inversify';
import { ICommandRegistry } from '@pixielity/ts-types';
import chalk from 'chalk';

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
          this.output.warning(`Command ${task.command.getName()} execution aborted by beforeExecute hook.`);
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

export { CommandScheduler };
//# sourceMappingURL=scheduler.mjs.map
//# sourceMappingURL=scheduler.mjs.map