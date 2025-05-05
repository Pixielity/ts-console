import { BaseCommand } from '../command/base-command.mjs';
import '@pixielity/ts-types';

/**
 * DemoCommand implementation
 *
 * Demonstrates UI features.
 */
declare class DemoCommand extends BaseCommand {
    /**
     * The feature option
     */
    private feature;
    /**
     * Executes the command
     *
     * @returns {Promise<number>} The exit code
     */
    execute(): Promise<number>;
    /**
     * Demonstrates the Ask utility
     *
     * @private
     */
    private demoAsk;
    /**
     * Demonstrates the TableOutput utility
     *
     * @private
     */
    private demoTable;
    /**
     * Demonstrates the ProgressBar utility
     *
     * @private
     */
    private demoProgress;
    /**
     * Sleeps for the specified number of milliseconds
     *
     * @param {number} ms - The number of milliseconds to sleep
     * @returns {Promise<void>} A promise that resolves after the specified time
     * @private
     */
    private sleep;
}

export { DemoCommand };
