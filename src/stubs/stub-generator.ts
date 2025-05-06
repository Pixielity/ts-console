import * as fs from 'fs'
import * as path from 'path'
import { injectable } from 'inversify'
import type { IStubGenerator } from '@pixielity/ts-types'

/**
 * Stub Generator class
 *
 * Handles the generation of files from stub templates.
 */
@injectable()
export class StubGenerator implements IStubGenerator {
  /**
   * The directory containing the stub templates
   * @private
   */
  private stubsDir: string

  /**
   * Creates a new StubGenerator instance
   *
   * @param {string} stubsDir - The directory containing the stub templates
   */
  constructor(stubsDir: string) {
    this.stubsDir = stubsDir
  }

  /**
   * Generates a file from a stub template
   *
   * @param {string} stubName - The name of the stub template
   * @param {string} outputPath - The path where the generated file will be saved
   * @param {Record<string, string>} replacements - Map of placeholders to their replacements
   * @returns {boolean} True if the file was generated successfully, false otherwise
   */
  public generate(
    stubName: string,
    outputPath: string,
    replacements: Record<string, string>,
  ): boolean {
    try {
      const stubPath = path.join(this.stubsDir, `${stubName}.stub`)

      if (!fs.existsSync(stubPath)) {
        throw new Error(`Stub template "${stubName}" not found.`)
      }

      let content = fs.readFileSync(stubPath, 'utf8')

      // Replace placeholders with their values
      for (const [placeholder, value] of Object.entries(replacements)) {
        content = content.replace(new RegExp(`\\{\\{${placeholder}\\}\\}`, 'g'), value)
      }

      // Create directory if it doesn't exist
      const dir = path.dirname(outputPath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      // Write the generated file
      fs.writeFileSync(outputPath, content)

      return true
    } catch (error) {
      console.error(
        `Error generating file: ${error instanceof Error ? error.message : String(error)}`,
      )
      return false
    }
  }

  /**
   * Gets the list of available stub templates
   *
   * @returns {string[]} Array of stub template names
   */
  public getAvailableStubs(): string[] {
    try {
      return fs
        .readdirSync(this.stubsDir)
        .filter((file) => file.endsWith('.stub'))
        .map((file) => file.replace('.stub', ''))
    } catch (error) {
      console.error(
        `Error getting available stubs: ${error instanceof Error ? error.message : String(error)}`,
      )
      return []
    }
  }
}
