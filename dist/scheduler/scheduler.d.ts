import { ICommandScheduler, ICommandRegistry, IScheduleExpression, IScheduledTask } from '@pixielity/ts-types';

/**
 * Command scheduler class
 *
 * Schedules commands to run at specific intervals.
 */
declare class CommandScheduler implements ICommandScheduler {
    /**
     * The scheduled tasks
     * @private
     */
    private tasks;
    /**
     * The command registry
     * @private
     */
    private commandRegistry;
    /**
     * The output instance
     * @private
     */
    private output;
    /**
     * The timer ID for the scheduler
     * @private
     */
    private timer?;
    /**
     * Creates a new CommandScheduler instance
     *
     * @param {ICommandRegistry} commandRegistry - The command registry
     */
    constructor(commandRegistry: ICommandRegistry);
    /**
     * Schedules a command to run at a specific interval
     *
     * @param {string} commandName - The name of the command
     * @param {IScheduleExpression} expression - The schedule expression
     * @param {string[]} args - The arguments to pass to the command
     * @param {Record<string, any>} options - The options to pass to the command
     * @returns {CommandScheduler} The scheduler instance for chaining
     */
    schedule(commandName: string, expression: IScheduleExpression, args?: string[], options?: Record<string, any>): CommandScheduler;
    /**
     * Starts the scheduler
     *
     * @param {number} interval - The interval in milliseconds to check for tasks to run
     * @returns {CommandScheduler} The scheduler instance for chaining
     */
    start(interval?: number): CommandScheduler;
    /**
     * Stops the scheduler
     *
     * @returns {CommandScheduler} The scheduler instance for chaining
     */
    stop(): CommandScheduler;
    /**
     * Gets all scheduled tasks
     *
     * @returns {IScheduledTask[]} The scheduled tasks
     */
    getTasks(): IScheduledTask[];
    /**
     * Clears all scheduled tasks
     *
     * @returns {CommandScheduler} The scheduler instance for chaining
     */
    clearTasks(): CommandScheduler;
    /**
     * Runs a scheduled task
     *
     * @param {IScheduledTask} task - The task to run
     * @returns {Promise<void>}
     * @private
     */
    private runTask;
    /**
     * Checks for tasks to run
     *
     * @returns {Promise<void>}
     * @private
     */
    private tick;
    /**
     * Calculates the next run time for a schedule expression
     *
     * @param {IScheduleExpression} expression - The schedule expression
     * @returns {Date} The next run time
     * @private
     */
    private calculateNextRun;
}

export { CommandScheduler };
