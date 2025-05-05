import * as path from 'path'
import * as fs from 'fs'
import chalk from 'chalk'
import { inject } from 'inversify'
import { IStubGenerator } from '@pixielity/ts-types'

import { BaseCommand } from '../command/base-command'
import { Command } from '../decorators/command.decorator'
import { Argument } from '../decorators/argument.decorator'
import { Option } from '../decorators/option.decorator'
import { Ask } from '../ui/ask'

/**
 * MakeCommand implementation
 *
 * Generates new command files from stub templates.
 */
@Command({
  name: 'make:command',
  description: 'Create a new console command',
})
export class MakeCommand extends BaseCommand {
  /**
   * The command name argument
   */
  @Argument({
    name: 'name',
    description: 'The name of the command (e.g., app:greet)',
    required: true,
  })
  private commandName!: string

  /**
   * The output directory option
   */
  @Option({
    flags: '-d, --dir <directory>',
    description: 'The directory where the command will be created',
    defaultValue: 'src/commands',
  })
  private directory!: string

  /**
   * The command description option
   */
  @Option({
    flags: '--description <description>',
    description: 'The description of the command',
  })
  private commandDescription!: string

  /**
   * The stub generator instance
   * @private
   */
  private readonly stubGenerator: IStubGenerator

  /**
   * Creates a new MakeCommand instance
   * @param {IStubGenerator} stubGenerator - The stub generator
   */
  constructor(@inject(IStubGenerator.$) stubGenerator: IStubGenerator) {
    super()
    this.stubGenerator = stubGenerator
  }

  /**
   * Executes the command
   * @returns {Promise<number>} The exit code
   */
  public async execute(): Promise<number> {
    try {
      // Get command name from argument
      const name = this.input.getArgument('0') || this.commandName

      if (!name) {
        // If no name provided, ask for it
        const inputName = await Ask.input('What should the command be named?')
        if (!inputName) {
          this.error('Command name is required.')
          return BaseCommand.INVALID
        }
        this.commandName = inputName
      } else {
        this.commandName = name
      }

      // Get or ask for description
      let description = (this.input.getOption('description') as string) || this.commandDescription
      if (!description) {
        description = await Ask.input(
          'Enter a description for the command:',
          'A custom console command',
        )
        this.commandDescription = description
      }

      // Convert command name to class name (e.g., hello:world -> HelloWorldCommand)
      const className = this.getClassName(this.commandName)

      // Get output directory
      const outputDir = (this.input.getOption('dir') as string) || this.directory

      // Generate the command file
      const outputPath = path.join(
        process.cwd(),
        outputDir,
        `${this.getFileName(this.commandName)}.ts`,
      )

      // Check if file already exists
      if (fs.existsSync(outputPath)) {
        const overwrite = await Ask.confirm(`File ${outputPath} already exists. Overwrite?`, false)
        if (!overwrite) {
          this.info('Command creation cancelled.')
          return BaseCommand.SUCCESS
        }
      }

      const success = this.stubGenerator.generate('command', outputPath, {
        name: this.commandName,
        className,
        commandName: this.commandName,
        description,
      })

      if (success) {
        this.success(
          `Command ${chalk.green(this.commandName)} created successfully at ${chalk.cyan(outputPath)}`,
        )
        return BaseCommand.SUCCESS
      } else {
        this.error(`Failed to create command ${this.commandName}`)
        return BaseCommand.FAILURE
      }
    } catch (error) {
      this.error(`An error occurred: ${error instanceof Error ? error.message : String(error)}`)
      return BaseCommand.FAILURE
    }
  }

  /**
   * Converts a command name to a class name
   *
   * @param {string} name - The command name
   * @returns {string} The class name
   * @private
   */
  private getClassName(name: string): string {
    return (
      name
        .split(':')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('') + 'Command'
    )
  }

  /**
   * Converts a command name to a file name
   *
   * @param {string} name - The command name
   * @returns {string} The file name
   * @private
   */
  private getFileName(name: string): string {
    return name.replace(':', '-') + '-command'
  }
}
