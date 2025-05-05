import { ICommandRegistry } from '@pixielity/ts-types';
import { BaseCommand } from '../command/base-command.js';

/**
 * ListCommand implementation
 *
 * Lists all available commands in the application.
 */
declare class ListCommand extends BaseCommand {
    /**
     * The command registry
     * @private
     */
    private registry;
    /**
     * Creates a new ListCommand instance
     *
     * @param {ICommandRegistry} registry - The command registry
     */
    constructor(registry: ICommandRegistry);
    /**
     * Executes the command
     *
     * @returns {Promise<number>} The exit code
     */
    execute(): Promise<number>;
}

export { ListCommand };
