import { ICommandRegistry } from '@pixielity/ts-types';
import { BaseCommand } from '../command/base-command.mjs';

/**
 * HelpCommand implementation
 *
 * Displays help information for a specific command.
 */
declare class HelpCommand extends BaseCommand {
    /**
     * The command registry
     * @private
     */
    private registry;
    /**
     * Creates a new HelpCommand instance
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

export { HelpCommand };
