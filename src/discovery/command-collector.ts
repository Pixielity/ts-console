import * as path from 'path'
import { glob } from 'glob'
import { injectable } from 'inversify'
import { ICommand } from '@pixielity/ts-types'
import type { ICommandCollector } from '@pixielity/ts-types'

import { container } from '../di/container'
import { COMMAND_METADATA_KEY } from '../decorators/command.decorator'

/**
 * Command collector class
 *
 * Discovers and collects commands from the file system.
 */
@injectable()
export class CommandCollector implements ICommandCollector {
  /**
   * Discovers commands in the specified directory
   *
   * @param {string} directory - The directory to scan for commands
   * @param {string} pattern - The glob pattern to match command files
   * @returns {Promise<ICommand[]>} The discovered commands
   */
  public async discoverCommands(
    directory: string,
    pattern = '**/*-command.{ts,js}',
  ): Promise<ICommand[]> {
    return CommandCollector.discoverCommands(directory, pattern)
  }

  /**
   * Gets all commands that have been registered with the container
   *
   * @returns {ICommand[]} The registered commands
   */
  public getRegisteredCommands(): ICommand[] {
    return CommandCollector.getRegisteredCommands()
  }

  /**
   * Gets command metadata for a command class
   *
   * @param {Function} commandClass - The command class
   * @returns {any} The command metadata
   */
  public getCommandMetadata(commandClass: Function): any {
    return CommandCollector.getCommandMetadata(commandClass)
  }

  /**
   * Discovers commands in the specified directory
   *
   * @param {string} directory - The directory to scan for commands
   * @param {string} pattern - The glob pattern to match command files
   * @returns {Promise<ICommand[]>} The discovered commands
   */
  public static async discoverCommands(
    directory: string,
    pattern = '**/*-command.{ts,js}',
  ): Promise<ICommand[]> {
    try {
      // Get absolute path
      const absolutePath = path.isAbsolute(directory)
        ? directory
        : path.join(process.cwd(), directory)

      // Find all command files
      const files = await glob(pattern, {
        cwd: absolutePath,
        absolute: true,
      })

      // Import each file
      for (const file of files) {
        try {
          // Use require instead of dynamic import for TypeScript files
          require(file)
        } catch (error) {
          console.error(`Error importing command file ${file}:`, error)
        }
      }

      // Get all registered commands from the container
      return container.getAll<ICommand>(ICommand.$)
    } catch (error) {
      console.error('Error discovering commands:', error)
      return []
    }
  }

  /**
   * Gets all commands that have been registered with the container
   *
   * @returns {ICommand[]} The registered commands
   */
  public static getRegisteredCommands(): ICommand[] {
    return container.getAll<ICommand>(ICommand.$)
  }

  /**
   * Gets command metadata for a command class
   *
   * @param {Function} commandClass - The command class
   * @returns {any} The command metadata
   */
  public static getCommandMetadata(commandClass: Function): any {
    return Reflect.getMetadata(COMMAND_METADATA_KEY, commandClass)
  }
}
