import { BaseCommand } from '../command/base-command.js';
import '@pixielity/ts-types';

/**
 * GreetCommand implementation
 *
 * A simple command to greet the user.
 */
declare class GreetCommand extends BaseCommand {
    /**
     * The uppercase option
     */
    private uppercase;
    /**
     * The color option
     */
    private color;
    /**
     * Executes the command
     *
     * @returns {Promise<number>} The exit code
     */
    execute(): Promise<number>;
}

export { GreetCommand };
