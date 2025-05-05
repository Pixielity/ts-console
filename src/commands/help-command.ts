import chalk from 'chalk'
import { inject } from 'inversify'
import { ICommandRegistry } from '@pixielity/ts-types'

import { BaseCommand } from '../command/base-command'
import {
  ARGUMENT_METADATA_KEY,
  Command,
  COMMAND_METADATA_KEY,
  OPTION_METADATA_KEY,
} from '../decorators'

/**
 * HelpCommand implementation
 *
 * Displays help information for a specific command.
 */
@Command({
  name: 'help',
  description: 'Display help for a command',
  shortcuts: [
    {
      flag: '-h, --help-cmd <command>',
      description: 'Display help for a specific command',
    },
  ],
})
export class HelpCommand extends BaseCommand {
  /**
   * The command registry
   * @private
   */
  private registry: ICommandRegistry

  /**
   * Creates a new HelpCommand instance
   *
   * @param {ICommandRegistry} registry - The command registry
   */
  constructor(@inject(ICommandRegistry.$) registry: ICommandRegistry) {
    super('help', 'Display help for a command')
    this.registry = registry
  }

  /**
   * Executes the command
   *
   * @returns {Promise<number>} The exit code
   */
  public async execute(): Promise<number> {
    try {
      const commandName = this.input.getArgument('0')

      if (!commandName) {
        this.error('Command name is required.')
        this.line('')
        this.line('Usage: help <command>')
        return BaseCommand.INVALID
      }

      const command = this.registry.get(commandName)

      if (!command) {
        this.error(`Command "${commandName}" not found.`)
        return BaseCommand.FAILURE
      }

      // Get command metadata
      const metadata = Reflect.getMetadata(COMMAND_METADATA_KEY, command.constructor) || {}

      this.line(chalk.bold(`${command.getName()}: ${command.getDescription()}`))
      this.line('')

      // Show aliases if available
      if (metadata.aliases && metadata.aliases.length > 0) {
        this.line(chalk.cyan('Aliases:'))
        metadata.aliases.forEach((alias: string) => {
          this.line(`  ${chalk.yellow(alias)}`)
        })
        this.line('')
      }

      // Show shortcuts if available
      if (metadata.shortcuts && metadata.shortcuts.length > 0) {
        this.line(chalk.cyan('Shortcuts:'))
        metadata.shortcuts.forEach((shortcut: any) => {
          this.line(`  ${chalk.magenta(shortcut.flag)}: ${shortcut.description}`)
        })
        this.line('')
      }

      // Show arguments if available
      const argumentsMetadata =
        Reflect.getMetadata(ARGUMENT_METADATA_KEY, command.constructor) || []
      if (argumentsMetadata.length > 0) {
        this.line(chalk.cyan('Arguments:'))
        argumentsMetadata.forEach((arg: any) => {
          this.line(`  ${chalk.green(arg.name)}: ${arg.description || 'No description'}`)
        })
        this.line('')
      }

      // Show options if available
      const optionsMetadata = Reflect.getMetadata(OPTION_METADATA_KEY, command.constructor) || []
      if (optionsMetadata.length > 0) {
        this.line(chalk.cyan('Options:'))
        optionsMetadata.forEach((opt: any) => {
          this.line(`  ${chalk.green(opt.flags)}: ${opt.description || 'No description'}`)
        })
        this.line('')
      }

      return BaseCommand.SUCCESS
    } catch (error) {
      this.error(`An error occurred: ${error instanceof Error ? error.message : String(error)}`)
      return BaseCommand.FAILURE
    }
  }
}
