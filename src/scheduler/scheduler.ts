import { injectable, inject } from 'inversify'
import { ICommandRegistry } from '@pixielity/ts-types'
import type { ICommandScheduler } from '@pixielity/ts-types'
import type { IScheduleExpression } from '@pixielity/ts-types'
import type { IScheduledTask } from '@pixielity/ts-types'

import { Output } from '../output/output'

/**
 * Command scheduler class
 *
 * Schedules commands to run at specific intervals.
 */
@injectable()
export class CommandScheduler implements ICommandScheduler {
  /**
   * The scheduled tasks
   * @private
   */
  private tasks: IScheduledTask[] = []

  /**
   * The command registry
   * @private
   */
  private commandRegistry: ICommandRegistry

  /**
   * The output instance
   * @private
   */
  private output: Output

  /**
   * The timer ID for the scheduler
   * @private
   */
  private timer?: NodeJS.Timeout

  /**
   * Creates a new CommandScheduler instance
   *
   * @param {ICommandRegistry} commandRegistry - The command registry
   */
  constructor(@inject(ICommandRegistry.$) commandRegistry: ICommandRegistry) {
    this.commandRegistry = commandRegistry
    this.output = new Output()
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
  public schedule(
    commandName: string,
    expression: IScheduleExpression,
    args: string[] = [],
    options: Record<string, any> = {},
  ): CommandScheduler {
    const command = this.commandRegistry.get(commandName)

    if (!command) {
      throw new Error(`Command "${commandName}" not found.`)
    }

    this.tasks.push({
      command,
      args,
      options,
      expression,
      nextRun: this.calculateNextRun(expression),
    })

    return this
  }

  /**
   * Starts the scheduler
   *
   * @param {number} interval - The interval in milliseconds to check for tasks to run
   * @returns {CommandScheduler} The scheduler instance for chaining
   */
  public start(interval = 60000): CommandScheduler {
    if (this.timer) {
      clearInterval(this.timer)
    }

    this.timer = setInterval(() => this.tick(), interval)
    this.output.info('Scheduler started.')

    return this
  }

  /**
   * Stops the scheduler
   *
   * @returns {CommandScheduler} The scheduler instance for chaining
   */
  public stop(): CommandScheduler {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = undefined
      this.output.info('Scheduler stopped.')
    }

    return this
  }

  /**
   * Gets all scheduled tasks
   *
   * @returns {IScheduledTask[]} The scheduled tasks
   */
  public getTasks(): IScheduledTask[] {
    return [...this.tasks]
  }

  /**
   * Clears all scheduled tasks
   *
   * @returns {CommandScheduler} The scheduler instance for chaining
   */
  public clearTasks(): CommandScheduler {
    this.tasks = []
    return this
  }

  /**
   * Runs a scheduled task
   *
   * @param {IScheduledTask} task - The task to run
   * @returns {Promise<void>}
   * @private
   */
  private async runTask(task: IScheduledTask): Promise<void> {
    try {
      this.output.info(`Running scheduled command: ${task.command.getName()}`)

      // Set output
      task.command.setOutput(new Output())

      // Set arguments and options
      task.command.setArguments(task.args)
      task.command.setOptions(task.options)

      // Run before execute hook if it exists
      if (task.command.beforeExecute) {
        const shouldContinue = await task.command.beforeExecute()
        if (!shouldContinue) {
          this.output.warning(
            `Command ${task.command.getName()} execution aborted by beforeExecute hook.`,
          )
          return
        }
      }

      // Execute the command
      const exitCode = await task.command.execute()

      // Run after execute hook if it exists
      if (task.command.afterExecute) {
        await task.command.afterExecute(exitCode)
      }

      // Update last run time
      task.lastRun = new Date()
      // Calculate next run time
      task.nextRun = this.calculateNextRun(task.expression)

      this.output.success(`Command ${task.command.getName()} executed successfully.`)
    } catch (error) {
      this.output.error(
        `Error running command ${task.command.getName()}: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  /**
   * Checks for tasks to run
   *
   * @returns {Promise<void>}
   * @private
   */
  private async tick(): Promise<void> {
    const now = new Date()

    for (const task of this.tasks) {
      if (task.nextRun && task.nextRun <= now) {
        await this.runTask(task)
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
  private calculateNextRun(expression: IScheduleExpression): Date {
    const now = new Date()
    const next = new Date(now)

    // Set to the next minute
    next.setSeconds(0)
    next.setMilliseconds(0)
    next.setMinutes(next.getMinutes() + 1)

    // Handle minute
    if (expression.minute !== undefined && expression.minute !== '*') {
      const minute = Number(expression.minute)
      next.setMinutes(minute)
      if (next <= now) {
        next.setHours(next.getHours() + 1)
      }
    }

    // Handle hour
    if (expression.hour !== undefined && expression.hour !== '*') {
      const hour = Number(expression.hour)
      next.setHours(hour)
      if (next <= now) {
        next.setDate(next.getDate() + 1)
      }
    }

    // Handle day of month
    if (expression.dayOfMonth !== undefined && expression.dayOfMonth !== '*') {
      const day = Number(expression.dayOfMonth)
      next.setDate(day)
      if (next <= now) {
        next.setMonth(next.getMonth() + 1)
      }
    }

    // Handle month
    if (expression.month !== undefined && expression.month !== '*') {
      const month = Number(expression.month) - 1 // JavaScript months are 0-based
      next.setMonth(month)
      if (next <= now) {
        next.setFullYear(next.getFullYear() + 1)
      }
    }

    // Handle day of week
    if (expression.dayOfWeek !== undefined && expression.dayOfWeek !== '*') {
      const dayOfWeek = Number(expression.dayOfWeek)
      const currentDayOfWeek = next.getDay()
      const daysToAdd = (dayOfWeek - currentDayOfWeek + 7) % 7
      if (daysToAdd > 0) {
        next.setDate(next.getDate() + daysToAdd)
      } else if (next <= now) {
        next.setDate(next.getDate() + 7)
      }
    }

    return next
  }
}
