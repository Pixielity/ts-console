import { IStubGenerator } from '@pixielity/ts-types';
import { BaseCommand } from '../command/base-command.mjs';

/**
 * MakeCommand implementation
 *
 * Generates new command files from stub templates.
 */
declare class MakeCommand extends BaseCommand {
    /**
     * The command name argument
     */
    private commandName;
    /**
     * The output directory option
     */
    private directory;
    /**
     * The command description option
     */
    private commandDescription;
    /**
     * The stub generator instance
     * @private
     */
    private readonly stubGenerator;
    /**
     * Creates a new MakeCommand instance
     * @param {IStubGenerator} stubGenerator - The stub generator
     */
    constructor(stubGenerator: IStubGenerator);
    /**
     * Executes the command
     * @returns {Promise<number>} The exit code
     */
    execute(): Promise<number>;
    /**
     * Converts a command name to a class name
     *
     * @param {string} name - The command name
     * @returns {string} The class name
     * @private
     */
    private getClassName;
    /**
     * Converts a command name to a file name
     *
     * @param {string} name - The command name
     * @returns {string} The file name
     * @private
     */
    private getFileName;
}

export { MakeCommand };
