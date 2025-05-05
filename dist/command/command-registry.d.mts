import { ICommandRegistry, ICommand } from '@pixielity/ts-types';

/**
 * Registry for console commands
 *
 * Stores and manages all registered commands.
 */
declare class CommandRegistry implements ICommandRegistry {
    /**
     * Map of command names to command instances
     * @private
     */
    private commands;
    /**
     * Adds a command to the registry
     *
     * @param {ICommand} command - The command to add
     * @throws {Error} If a command with the same name already exists
     */
    add(command: ICommand): void;
    /**
     * Gets a command by name
     *
     * @param {string} name - The name of the command
     * @returns {ICommand | undefined} The command or undefined if not found
     */
    get(name: string): ICommand | undefined;
    /**
     * Gets all registered commands
     *
     * @returns {ICommand[]} Array of all registered commands
     */
    getAll(): ICommand[];
    /**
     * Checks if a command exists
     *
     * @param {string} name - The name of the command
     * @returns {boolean} True if the command exists, false otherwise
     */
    has(name: string): boolean;
    /**
     * Removes a command from the registry
     *
     * @param {string} name - The name of the command
     * @returns {boolean} True if the command was removed, false otherwise
     */
    remove(name: string): boolean;
    /**
     * Clears all commands from the registry
     */
    clear(): void;
}

export { CommandRegistry };
