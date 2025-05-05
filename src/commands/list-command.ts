import { ICommandRegistry } from '@pixielity/ts-types'
import { inject } from 'inversify'

import { BaseCommand } from '../command/base-command'
import { Command } from '../decorators/command.decorator'
import { TableOutput } from '../ui/table'
import { COMMAND_METADATA_KEY } from '../decorators/command.decorator'
import chalk from 'chalk'

/**
 * ListCommand implementation
 *
 * Lists all available commands in the application.
 */
@Command({
  name: 'list',
  description: 'List all available commands',
  aliases: ['commands'],
  shortcuts: [
    {
      flag: '-l, --list',
      description: 'List all available commands',
    },
  ],
})
export class ListCommand extends BaseCommand {
  /**
   * The command registry
   * @private
   */
  private registry: ICommandRegistry

  /**
   * Creates a new ListCommand instance
   *
   * @param {ICommandRegistry} registry - The command registry
   */
  constructor(@inject(ICommandRegistry.$) registry: ICommandRegistry) {
    super()
    this.registry = registry
  }

  /**
   * Executes the command
   *
   * @returns {Promise<number>} The exit code
   */
  public async execute(): Promise<number> {
    try {
      const commands = this.registry.getAll()

      this.line(chalk.bold('Available commands:'))
      this.line(chalk.dim('Use command name, alias, or shortcut to run a command'))
      this.line('')

      if (commands.length === 0) {
        this.line('  No commands registered.')
        return BaseCommand.SUCCESS
      }

      // Group commands by category (first part of name before ":")
      const commandGroups: Record<string, typeof commands> = {}

      commands.forEach((command) => {
        const name = command.getName()
        const category = name.includes(':') ? name.split(':')[0] : 'general'

        if (!commandGroups[category]) {
          commandGroups[category] = []
        }

        commandGroups[category].push(command)
      })

      // Create and display tables for each group
      for (const [category, groupCommands] of Object.entries(commandGroups)) {
        this.line(chalk.cyan(`${category.charAt(0).toUpperCase() + category.slice(1)} Commands:`))

        const table = new TableOutput(['Command', 'Aliases', 'Shortcuts', 'Description'])

        // Sort commands alphabetically within each group
        groupCommands.sort((a, b) => a.getName().localeCompare(b.getName()))

        groupCommands.forEach((command) => {
          // Get command metadata to check for aliases and shortcuts
          const metadata = Reflect.getMetadata(COMMAND_METADATA_KEY, command.constructor) || {}
          const aliases = metadata.aliases ? metadata.aliases.join(', ') : ''

          // Extract shortcuts in a more readable format
          let shortcuts = ''
          if (metadata.shortcuts && metadata.shortcuts.length > 0) {
            shortcuts = metadata.shortcuts
              .map((s: any) => {
                // Extract the first part of the flag (the short version)
                const shortFlag = s.flag.split(',')[0].trim()
                return shortFlag
              })
              .join(', ')
          }

          // Skip hidden commands
          if (metadata.hidden) {
            return
          }

          table.addRow([
            chalk.green(command.getName()),
            aliases ? chalk.yellow(aliases) : '',
            shortcuts ? chalk.magenta(shortcuts) : '',
            command.getDescription(),
          ])
        })

        table.render()
        this.line('')
      }

      return BaseCommand.SUCCESS
    } catch (error) {
      this.error(`An error occurred: ${error instanceof Error ? error.message : String(error)}`)
      return BaseCommand.FAILURE
    }
  }
}
