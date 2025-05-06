import cliProgress from 'cli-progress'
import chalk from 'chalk'
import type { IProgressBar } from '@pixielity/ts-types'
import type { IProgressBarFormat } from '@pixielity/ts-types'
import { injectable } from 'inversify'

/**
 * Progress bar utility class
 *
 * Provides methods for displaying progress bars in the console.
 */
@injectable()
export class ProgressBar implements IProgressBar {
  /**
   * The progress bar instance
   * @private
   */
  private bar: cliProgress.SingleBar

  /**
   * Creates a new ProgressBar instance
   *
   * @param {number} total - The total value
   * @param {IProgressBarFormat} format - The format options
   */
  constructor(total = 100, format?: IProgressBarFormat) {
    this.bar = new cliProgress.SingleBar({
      format:
        format?.format || `${chalk.cyan('{bar}')} {percentage}% | ETA: {eta}s | {value}/{total}`,
      barCompleteChar: format?.barCompleteChar || '\u2588',
      barIncompleteChar: format?.barIncompleteChar || '\u2591',
    })

    this.bar.start(total, 0)
  }

  /**
   * Updates the progress bar
   *
   * @param {number} value - The current value
   * @param {Record<string, any>} payload - Additional payload data
   */
  public update(value: number, payload?: Record<string, any>): void {
    this.bar.update(value, payload)
  }

  /**
   * Increments the progress bar
   *
   * @param {number} value - The value to increment by
   * @param {Record<string, any>} payload - Additional payload data
   */
  public increment(value = 1, payload?: Record<string, any>): void {
    this.bar.increment(value, payload)
  }

  /**
   * Stops the progress bar
   */
  public stop(): void {
    this.bar.stop()
  }

  /**
   * Creates a multi-bar container
   *
   * @returns {cliProgress.MultiBar} The multi-bar container
   */
  public static createMultiBar(): cliProgress.MultiBar {
    return new cliProgress.MultiBar({
      format: `${chalk.cyan('{bar}')} {percentage}% | ETA: {eta}s | {value}/{total}`,
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
    })
  }
}
