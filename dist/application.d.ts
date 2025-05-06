import { IConsoleApplication, ICommandRegistry, ICommandCollector, ICommand } from '@pixielity/ts-types';

/**
 * Console Application class
 *
 * Manages the console commands and their execution using Commander.js.
 */
declare class Application implements IConsoleApplication {
    /**
     * The name of the application
     * @private
     */
    private name;
    /**
     * The version of the application
     * @private
     */
    private version;
    /**
     * The command registry that stores all registered commands
     * @private
     */
    private commandRegistry;
    /**
     * The command collector for discovering commands
     * @private
     */
    private commandCollector;
    /**
     * The Commander.js program instance
     * @private
     */
    private program;
    /**
     * Map of shortcuts to command names
     * @private
     */
    private shortcutMap;
    /**
     * Creates a new Console Application instance
     *
     * @param {ICommandRegistry} commandRegistry - The command registry
     * @param {ICommandCollector} commandCollector - The command collector
     * @param {ICommand[]} commands - The commands to register
     * @param {string} name - The name of the application
     * @param {string} version - The version of the application
     */
    constructor(commandRegistry: ICommandRegistry, commandCollector: ICommandCollector, commands?: ICommand[], name?: string, version?: string);
    /**
     * Add global options/shortcuts to the application
     *
     * @private
     */
    private addGlobalOptions;
    /**
     * Register command-specific shortcuts
     *
     * @param {string} commandName - The name of the command
     * @param {CommandShortcut[]} shortcuts - The shortcuts to register
     * @private
     */
    private registerCommandShortcuts;
    /**
     * Handle global options/shortcuts
     *
     * @param {any} options - The parsed options
     * @returns {Promise<boolean>} True if an option was handled, false otherwise
     * @private
     */
    private handleGlobalOptions;
    /**
     * Gets the name of the application
     *
     * @returns {string} The application name
     */
    getName(): string;
    /**
     * Sets the name of the application
     *
     * @param {string} name - The new application name
     * @returns {Application} The application instance for chaining
     */
    setName(name: string): Application;
    /**
     * Gets the version of the application
     *
     * @returns {string} The application version
     */
    getVersion(): string;
    /**
     * Sets the version of the application
     *
     * @param {string} version - The new application version
     * @returns {Application} The application instance for chaining
     */
    setVersion(version: string): Application;
    /**
     * Gets all registered commands
     *
     * @returns {ICommand[]} Array of all registered commands
     */
    getCommands(): ICommand[];
    /**
     * Sets the commands for the application
     * This will clear existing commands and register the new ones
     *
     * @param {ICommand[]} commands - The commands to register
     * @returns {Application} The application instance for chaining
     */
    setCommands(commands: ICommand[]): Application;
    /**
     * Gets the command registry
     *
     * @returns {ICommandRegistry} The command registry
     */
    getCommandRegistry(): ICommandRegistry;
    /**
     * Gets the command collector
     *
     * @returns {ICommandCollector} The command collector
     */
    getCommandCollector(): ICommandCollector;
    /**
     * Registers a command with the application
     *
     * @param {ICommand} command - The command to register
     * @returns {Application} - The application instance for chaining
     */
    register(command: ICommand): Application;
    /**
     * Registers multiple commands with the application
     *
     * @param {ICommand[]} commands - The commands to register
     * @returns {Application} - The application instance for chaining
     */
    registerCommands(commands: ICommand[]): Application;
    /**
     * Discovers and registers commands from a directory
     *
     * @param {string} directory - The directory to scan for commands
     * @param {string} pattern - The glob pattern to match command files
     * @returns {Promise<Application>} - The application instance for chaining
     */
    discoverCommands(directory: string, pattern?: string): Promise<Application>;
    /**
     * Registers a command with Commander.js
     *
     * @param {ICommand} command - The command to register
     * @private
     */
    private registerWithCommander;
    /**
     * Processes command metadata from decorators
     *
     * @param {ICommand} command - The command instance
     * @param {Command} commanderCommand - The Commander.js command
     * @private
     */
    private processCommandMetadata;
    /**
     * Runs the application with the given arguments
     *
     * @param {string[]} argv - The command line arguments
     * @returns {Promise<void>}
     */
    run(argv?: string[]): Promise<void>;
}

export { Application };
