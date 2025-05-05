import { ICommandScheduler } from '@pixielity/ts-types';
import { BaseCommand } from '../command/base-command.mjs';

/**
 * ScheduleCommand implementation
 *
 * Manages scheduled tasks.
 */
declare class ScheduleCommand extends BaseCommand {
    /**
     * The action argument
     */
    private action;
    /**
     * The command scheduler
     * @private
     */
    private scheduler;
    /**
     * Creates a new ScheduleCommand instance
     *
     * @param {ICommandScheduler} scheduler - The command scheduler
     */
    constructor(scheduler: ICommandScheduler);
    /**
     * Executes the command
     *
     * @returns {Promise<number>} The exit code
     */
    execute(): Promise<number>;
    /**
     * Lists all scheduled tasks
     *
     * @returns {Promise<number>} The exit code
     * @private
     */
    private listTasks;
    /**
     * Starts the scheduler
     *
     * @returns {Promise<number>} The exit code
     * @private
     */
    private startScheduler;
    /**
     * Stops the scheduler
     *
     * @returns {Promise<number>} The exit code
     * @private
     */
    private stopScheduler;
    /**
     * Formats a schedule expression
     *
     * @param {any} expression - The schedule expression
     * @returns {string} The formatted expression
     * @private
     */
    private formatExpression;
}

export { ScheduleCommand };
