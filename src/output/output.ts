import chalk from 'chalk'
import type { IOutput } from '@pixielity/ts-types'

/**
 * Implementation of the IOutput interface
 *
 * Provides methods for writing to the console with formatting using chalk.
 */
export class Output implements IOutput {
  /**
   * Writes a message to the output
   *
   * @param {string} message - The message to write
   */
  public write(message: string): void {
    process.stdout.write(message)
  }

  /**
   * Writes a message to the output followed by a newline
   *
   * @param {string} message - The message to write
   */
  public writeln(message: string): void {
    console.log(message)
  }

  /**
   * Writes an error message to the output
   *
   * @param {string} message - The error message to write
   */
  public error(message: string): void {
    console.error(chalk.bold.red('ERROR') + ': ' + message)
  }

  /**
   * Writes a success message to the output
   *
   * @param {string} message - The success message to write
   */
  public success(message: string): void {
    console.log(chalk.bold.green('SUCCESS') + ': ' + message)
  }

  /**
   * Writes an info message to the output
   *
   * @param {string} message - The info message to write
   */
  public info(message: string): void {
    console.log(chalk.bold.blue('INFO') + ': ' + message)
  }

  /**
   * Writes a warning message to the output
   *
   * @param {string} message - The warning message to write
   */
  public warning(message: string): void {
    console.log(chalk.bold.yellow('WARNING') + ': ' + message)
  }

  /**
   * Writes a comment message to the output
   *
   * @param {string} message - The comment message to write
   */
  public comment(message: string): void {
    console.log(chalk.gray('// ' + message))
  }
}
