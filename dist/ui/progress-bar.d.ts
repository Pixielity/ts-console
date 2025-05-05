import cliProgress from 'cli-progress';
import { IProgressBar, IProgressBarFormat } from '@pixielity/ts-types';

/**
 * Progress bar utility class
 *
 * Provides methods for displaying progress bars in the console.
 */
declare class ProgressBar implements IProgressBar {
    /**
     * The progress bar instance
     * @private
     */
    private bar;
    /**
     * Creates a new ProgressBar instance
     *
     * @param {number} total - The total value
     * @param {IProgressBarFormat} format - The format options
     */
    constructor(total?: number, format?: IProgressBarFormat);
    /**
     * Updates the progress bar
     *
     * @param {number} value - The current value
     * @param {Record<string, any>} payload - Additional payload data
     */
    update(value: number, payload?: Record<string, any>): void;
    /**
     * Increments the progress bar
     *
     * @param {number} value - The value to increment by
     * @param {Record<string, any>} payload - Additional payload data
     */
    increment(value?: number, payload?: Record<string, any>): void;
    /**
     * Stops the progress bar
     */
    stop(): void;
    /**
     * Creates a multi-bar container
     *
     * @returns {cliProgress.MultiBar} The multi-bar container
     */
    static createMultiBar(): cliProgress.MultiBar;
}

export { ProgressBar };
