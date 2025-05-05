import { inject } from 'inversify'
import { ICommandScheduler } from '@pixielity/ts-types'

import { BaseCommand } from '../command/base-command'
import { Command } from '../decorators/command.decorator'
import { Argument } from '../decorators/argument.decorator'
import { TableOutput } from '../ui/table'

/**
 * ScheduleCommand implementation
 *
 * Manages scheduled tasks.
 */
@Command({
  name: 'schedule',
  description: 'Manage scheduled tasks',
})
export class ScheduleCommand extends BaseCommand {
  /**
   * The action argument
   */
  @Argument({
    name: 'action',
    description: 'The action to perform (list, run, start, stop)',
    required: true,
  })
  private action!: string

  /**
   * The command scheduler
   * @private
   */
  private scheduler: ICommandScheduler

  /**
   * Creates a new ScheduleCommand instance
   *
   * @param {ICommandScheduler} scheduler - The command scheduler
   */
  constructor(@inject(ICommandScheduler.$) scheduler: ICommandScheduler) {
    super()
    this.scheduler = scheduler
  }

  /**
   * Executes the command
   *
   * @returns {Promise<number>} The exit code
   */
  public async execute(): Promise<number> {
    try {
      const action = this.input.getArgument('0') || this.action

      switch (action) {
        case 'list':
          return this.listTasks()
        case 'start':
          return this.startScheduler()
        case 'stop':
          return this.stopScheduler()
        default:
          this.error(`Unknown action: ${action}`)
          this.line('Available actions: list, start, stop')
          return BaseCommand.INVALID
      }
    } catch (error) {
      this.error(`An error occurred: ${error instanceof Error ? error.message : String(error)}`)
      return BaseCommand.FAILURE
    }
  }

  /**
   * Lists all scheduled tasks
   *
   * @returns {Promise<number>} The exit code
   * @private
   */
  private async listTasks(): Promise<number> {
    const tasks = this.scheduler.getTasks()

    if (tasks.length === 0) {
      this.info('No scheduled tasks.')
      return BaseCommand.SUCCESS
    }

    const table = new TableOutput(['Command', 'Schedule', 'Last Run', 'Next Run'])

    tasks.forEach((task) => {
      const expression = this.formatExpression(task.expression)
      const lastRun = task.lastRun ? task.lastRun.toLocaleString() : 'Never'
      const nextRun = task.nextRun ? task.nextRun.toLocaleString() : 'Unknown'

      table.addRow([task.command.getName(), expression, lastRun, nextRun])
    })

    this.line()
    table.render()
    this.line()

    return BaseCommand.SUCCESS
  }

  /**
   * Starts the scheduler
   *
   * @returns {Promise<number>} The exit code
   * @private
   */
  private async startScheduler(): Promise<number> {
    this.scheduler.start()
    this.success('Scheduler started.')
    return BaseCommand.SUCCESS
  }

  /**
   * Stops the scheduler
   *
   * @returns {Promise<number>} The exit code
   * @private
   */
  private async stopScheduler(): Promise<number> {
    this.scheduler.stop()
    this.success('Scheduler stopped.')
    return BaseCommand.SUCCESS
  }

  /**
   * Formats a schedule expression
   *
   * @param {any} expression - The schedule expression
   * @returns {string} The formatted expression
   * @private
   */
  private formatExpression(expression: any): string {
    const minute = expression.minute ?? '*'
    const hour = expression.hour ?? '*'
    const dayOfMonth = expression.dayOfMonth ?? '*'
    const month = expression.month ?? '*'
    const dayOfWeek = expression.dayOfWeek ?? '*'

    return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`
  }
}
