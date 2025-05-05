import { ICommandOptions } from '@pixielity/ts-types';

/**
 * Metadata key for command
 */
declare const COMMAND_METADATA_KEY: unique symbol;
/**
 * Command decorator
 *
 * Marks a class as a console command and registers it with the container
 *
 * @param {CommandOptions} options - The command options
 * @returns {ClassDecorator} The class decorator
 */
declare function Command(options: ICommandOptions): ClassDecorator;

export { COMMAND_METADATA_KEY, Command };
