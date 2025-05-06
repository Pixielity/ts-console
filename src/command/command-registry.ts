import { injectable } from 'inversify'
import type { ICommand } from '@pixielity/ts-types'
import type { ICommandRegistry } from '@pixielity/ts-types'

/**
 * Registry for console commands
 *
 * Stores and manages all registered commands.
 */
@injectable()
export class CommandRegistry implements ICommandRegistry {
  /**
   * Map of command names to command instances
   * @private
   */
  private commands: Map<string, ICommand> = new Map()

  /**
   * Adds a command to the registry
   *
   * @param {ICommand} command - The command to add
   * @throws {Error} If a command with the same name already exists
   */
  public add(command: ICommand): void {
    const name = command.getName()

    if (this.commands.has(name)) {
      throw new Error(`Command "${name}" already exists.`)
    }

    this.commands.set(name, command)
  }

  /**
   * Gets a command by name
   *
   * @param {string} name - The name of the command
   * @returns {ICommand | undefined} The command or undefined if not found
   */
  public get(name: string): ICommand | undefined {
    return this.commands.get(name)
  }

  /**
   * Gets all registered commands
   *
   * @returns {ICommand[]} Array of all registered commands
   */
  public getAll(): ICommand[] {
    return Array.from(this.commands.values())
  }

  /**
   * Checks if a command exists
   *
   * @param {string} name - The name of the command
   * @returns {boolean} True if the command exists, false otherwise
   */
  public has(name: string): boolean {
    return this.commands.has(name)
  }

  /**
   * Removes a command from the registry
   *
   * @param {string} name - The name of the command
   * @returns {boolean} True if the command was removed, false otherwise
   */
  public remove(name: string): boolean {
    return this.commands.delete(name)
  }

  /**
   * Clears all commands from the registry
   */
  public clear(): void {
    this.commands.clear()
  }
}
