import Table from 'cli-table3'
import { injectable } from "inversify"
import type { ITableOutput } from '@pixielity/ts-types'
import type { ITableStyle } from '@pixielity/ts-types'

/**
 * Table utility class
 *
 * Provides methods for displaying tables in the console.
 */
@injectable()
export class TableOutput implements ITableOutput {
  /**
   * The table instance
   * @private
   */
  private table: Table.Table

  /**
   * Creates a new TableOutput instance
   *
   * @param {string[]} headers - The table headers
   * @param {ITableStyle} style - The table style
   */
  constructor(headers: string[] = [], style?: ITableStyle) {
    this.table = new Table({
      head: headers,
      ...style,
    })
  }

  /**
   * Adds a row to the table
   *
   * @param {any[]} row - The row data
   * @returns {TableOutput} The table instance for chaining
   */
  public addRow(row: any[]): TableOutput {
    this.table.push(row)
    return this
  }

  /**
   * Adds multiple rows to the table
   *
   * @param {any[][]} rows - The rows data
   * @returns {TableOutput} The table instance for chaining
   */
  public addRows(rows: any[][]): TableOutput {
    rows.forEach((row) => this.addRow(row))
    return this
  }

  /**
   * Renders the table to a string
   *
   * @returns {string} The rendered table
   */
  public toString(): string {
    return this.table.toString()
  }

  /**
   * Renders the table to the console
   */
  public render(): void {
    console.log(this.toString())
  }

  /**
   * Creates a new table from an array of objects
   *
   * @param {Record<string, any>[]} data - The data
   * @param {string[]} columns - The columns to include
   * @param {ITableStyle} style - The table style
   * @returns {TableOutput} The table instance
   */
  public static fromObjects(data: Record<string, any>[], columns: string[], style?: ITableStyle): TableOutput {
    const headers = columns
    const table = new TableOutput(headers, style)

    data.forEach((item) => {
      const row = columns.map((column) => item[column] ?? "")
      table.addRow(row)
    })

    return table
  }
}
