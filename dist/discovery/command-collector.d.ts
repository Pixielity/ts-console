import { ICommandCollector, ICommand } from '@pixielity/ts-types';

/**
 * Command collector class
 *
 * Discovers and collects commands from the file system.
 */
declare class CommandCollector implements ICommandCollector {
    /**
     * Discovers commands in the specified directory
     *
     * @param {string} directory - The directory to scan for commands
     * @param {string} pattern - The glob pattern to match command files
     * @returns {Promise<ICommand[]>} The discovered commands
     */
    discoverCommands(directory: string, pattern?: string): Promise<ICommand[]>;
    /**
     * Gets all commands that have been registered with the container
     *
     * @returns {ICommand[]} The registered commands
     */
    getRegisteredCommands(): ICommand[];
    /**
     * Gets command metadata for a command class
     *
     * @param {Function} commandClass - The command class
     * @returns {any} The command metadata
     */
    getCommandMetadata(commandClass: Function): any;
    /**
     * Discovers commands in the specified directory
     *
     * @param {string} directory - The directory to scan for commands
     * @param {string} pattern - The glob pattern to match command files
     * @returns {Promise<ICommand[]>} The discovered commands
     */
    static discoverCommands(directory: string, pattern?: string): Promise<ICommand[]>;
    /**
     * Gets all commands that have been registered with the container
     *
     * @returns {ICommand[]} The registered commands
     */
    static getRegisteredCommands(): ICommand[];
    /**
     * Gets command metadata for a command class
     *
     * @param {Function} commandClass - The command class
     * @returns {any} The command metadata
     */
    static getCommandMetadata(commandClass: Function): any;
}

export { CommandCollector };
