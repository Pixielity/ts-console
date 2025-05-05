import { BaseCommand } from '../command/base-command'
import { Command } from '../decorators/command.decorator'
import { Option } from '../decorators/option.decorator'
import chalk from 'chalk'

/**
 * GreetCommand implementation
 *
 * A simple command to greet the user.
 */
@Command({
  name: 'greet',
  description: 'Greet the user',
  shortcuts: [
    {
      flag: '-g',
      description: 'Greet the user',
    },
  ],
})
export class GreetCommand extends BaseCommand {
  /**
   * The uppercase option
   */
  @Option({
    flags: '-u, --uppercase',
    description: 'Convert the greeting to uppercase',
  })
  private uppercase!: boolean

  /**
   * The color option
   */
  @Option({
    flags: '-c, --color <color>',
    description: 'The color of the greeting (red, green, blue, yellow, cyan)',
    defaultValue: 'green',
  })
  private color!: string

  /**
   * Executes the command
   *
   * @returns {Promise<number>} The exit code
   */
  public async execute(): Promise<number> {
    try {
      // Get arguments and options
      const name = this.input.getArgument('0') || 'World'
      const uppercase = this.input.getOption('uppercase') === true || this.uppercase || false
      const color = (this.input.getOption('color') as string) || this.color || 'green'

      // Build the greeting
      let greeting = `Hello, ${name}!`

      if (uppercase) {
        greeting = greeting.toUpperCase()
      }

      // Apply color
      let coloredGreeting: string
      switch (color) {
        case 'red':
          coloredGreeting = chalk.red(greeting)
          break
        case 'green':
          coloredGreeting = chalk.green(greeting)
          break
        case 'blue':
          coloredGreeting = chalk.blue(greeting)
          break
        case 'yellow':
          coloredGreeting = chalk.yellow(greeting)
          break
        case 'cyan':
          coloredGreeting = chalk.cyan(greeting)
          break
        default:
          coloredGreeting = chalk.green(greeting)
      }

      // Output the greeting
      this.line()
      this.line(coloredGreeting)
      this.line()

      return BaseCommand.SUCCESS
    } catch (error) {
      this.error(`An error occurred: ${error instanceof Error ? error.message : String(error)}`)
      return BaseCommand.FAILURE
    }
  }
}
