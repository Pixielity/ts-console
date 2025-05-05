import { ITableOutput, ITableStyle } from '@pixielity/ts-types';

/**
 * Table utility class
 *
 * Provides methods for displaying tables in the console.
 */
declare class TableOutput implements ITableOutput {
    /**
     * The table instance
     * @private
     */
    private table;
    /**
     * Creates a new TableOutput instance
     *
     * @param {string[]} headers - The table headers
     * @param {ITableStyle} style - The table style
     */
    constructor(headers?: string[], style?: ITableStyle);
    /**
     * Adds a row to the table
     *
     * @param {any[]} row - The row data
     * @returns {TableOutput} The table instance for chaining
     */
    addRow(row: any[]): TableOutput;
    /**
     * Adds multiple rows to the table
     *
     * @param {any[][]} rows - The rows data
     * @returns {TableOutput} The table instance for chaining
     */
    addRows(rows: any[][]): TableOutput;
    /**
     * Renders the table to a string
     *
     * @returns {string} The rendered table
     */
    toString(): string;
    /**
     * Renders the table to the console
     */
    render(): void;
    /**
     * Creates a new table from an array of objects
     *
     * @param {Record<string, any>[]} data - The data
     * @param {string[]} columns - The columns to include
     * @param {ITableStyle} style - The table style
     * @returns {TableOutput} The table instance
     */
    static fromObjects(data: Record<string, any>[], columns: string[], style?: ITableStyle): TableOutput;
}

export { TableOutput };
