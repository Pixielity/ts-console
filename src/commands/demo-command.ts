import chalk from 'chalk'
import { QuestionType } from '@pixielity/ts-types'

import { BaseCommand } from '../command/base-command'
import { Command } from '../decorators/command.decorator'
import { Option } from '../decorators/option.decorator'

import { Ask } from '../ui/ask'
import { TableOutput } from '../ui/table'
import { ProgressBar } from '../ui/progress-bar'

/**
 * DemoCommand implementation
 *
 * Demonstrates UI features.
 */
@Command({
  name: 'demo',
  description: 'Demonstrate UI features',
  shortcuts: [
    {
      flag: '-d',
      description: 'Demonstrate UI features',
    },
  ],
})
export class DemoCommand extends BaseCommand {
  /**
   * The feature option
   */
  @Option({
    flags: '-f, --feature <feature>',
    description: 'The feature to demonstrate (ask, table, progress)',
  })
  private feature!: string

  /**
   * Executes the command
   *
   * @returns {Promise<number>} The exit code
   */
  public async execute(): Promise<number> {
    try {
      const feature = (this.input.getOption('feature') as string) || this.feature

      if (!feature) {
        // If no feature specified, ask for it
        const selectedFeature = await Ask.select('Which feature would you like to see?', [
          { name: 'Interactive prompts', value: 'ask' },
          { name: 'Tables', value: 'table' },
          { name: 'Progress bars', value: 'progress' },
          { name: 'All features', value: 'all' },
        ])

        if (selectedFeature === 'all') {
          await this.demoAsk()
          await this.demoTable()
          await this.demoProgress()
        } else if (selectedFeature === 'ask') {
          await this.demoAsk()
        } else if (selectedFeature === 'table') {
          await this.demoTable()
        } else if (selectedFeature === 'progress') {
          await this.demoProgress()
        }
      } else {
        if (feature === 'ask') {
          await this.demoAsk()
        } else if (feature === 'table') {
          await this.demoTable()
        } else if (feature === 'progress') {
          await this.demoProgress()
        } else {
          this.error(`Unknown feature: ${feature}`)
          return BaseCommand.FAILURE
        }
      }

      return BaseCommand.SUCCESS
    } catch (error) {
      this.error(`An error occurred: ${error instanceof Error ? error.message : String(error)}`)
      return BaseCommand.FAILURE
    }
  }

  /**
   * Demonstrates the Ask utility
   *
   * @private
   */
  private async demoAsk(): Promise<void> {
    this.info('Demonstrating interactive prompts...')

    const name = await Ask.input("What's your name?")
    const age = await Ask.question({
      type: QuestionType.Number,
      name: 'age',
      message: 'How old are you?',
      validate: (input) => {
        if (isNaN(input) || input < 0) {
          return 'Please enter a valid age'
        }
        return true
      },
    })

    const likesCli = await Ask.confirm('Do you like CLI tools?')

    const favoriteColor = await Ask.select("What's your favorite color?", [
      'Red',
      'Green',
      'Blue',
      'Yellow',
      'Other',
    ])

    const languages = await Ask.multiSelect('Which programming languages do you know?', [
      'JavaScript',
      'TypeScript',
      'PHP',
      'Python',
      'Ruby',
      'Go',
      'Java',
      'C#',
    ])

    this.line()
    this.success('Survey complete!')
    this.line()
    this.line(`Name: ${chalk.cyan(name)}`)
    this.line(`Age: ${chalk.cyan(age)}`)
    this.line(`Likes CLI: ${likesCli ? chalk.green('Yes') : chalk.red('No')}`)
    this.line(`Favorite color: ${chalk.cyan(favoriteColor)}`)
    this.line(`Languages: ${languages.map((l) => chalk.cyan(l)).join(', ')}`)
    this.line()
  }

  /**
   * Demonstrates the TableOutput utility
   *
   * @private
   */
  private async demoTable(): Promise<void> {
    this.info('Demonstrating tables...')

    // Simple table
    const table = new TableOutput(['ID', 'Name', 'Email', 'Role'])

    table.addRows([
      [1, 'John Doe', 'john@example.com', 'Admin'],
      [2, 'Jane Smith', 'jane@example.com', 'User'],
      [3, 'Bob Johnson', 'bob@example.com', 'Editor'],
    ])

    this.line()
    table.render()
    this.line()

    // Table from objects
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', active: true },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', active: false },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', active: true },
    ]

    const objectTable = TableOutput.fromObjects(users, ['id', 'name', 'email', 'role'], {
      style: {
        head: ['cyan'],
        border: ['gray'],
      },
    })

    this.line()
    objectTable.render()
    this.line()
  }

  /**
   * Demonstrates the ProgressBar utility
   *
   * @private
   */
  private async demoProgress(): Promise<void> {
    this.info('Demonstrating progress bars...')

    // Simple progress bar
    const total = 100
    const bar = new ProgressBar(total)

    for (let i = 0; i <= total; i++) {
      bar.update(i)
      await this.sleep(20)
    }

    bar.stop()
    this.line()

    // Multi-bar
    this.info('Demonstrating multiple progress bars...')

    const multiBar = ProgressBar.createMultiBar()

    const bar1 = multiBar.create(100, 0, { task: 'Task 1' })
    const bar2 = multiBar.create(100, 0, { task: 'Task 2' })
    const bar3 = multiBar.create(100, 0, { task: 'Task 3' })

    for (let i = 0; i <= 100; i++) {
      bar1.update(i, { task: 'Task 1' })

      if (i >= 30) {
        bar2.update(Math.min(Math.floor((i - 30) * 1.5), 100), { task: 'Task 2' })
      }

      if (i >= 60) {
        bar3.update(Math.min(Math.floor((i - 60) * 2.5), 100), { task: 'Task 3' })
      }

      await this.sleep(30)
    }

    multiBar.stop()
    this.line()

    this.success('Progress bar demonstration complete!')
  }

  /**
   * Sleeps for the specified number of milliseconds
   *
   * @param {number} ms - The number of milliseconds to sleep
   * @returns {Promise<void>} A promise that resolves after the specified time
   * @private
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
