import { IStubGenerator } from '@pixielity/ts-types';

/**
 * Stub Generator class
 *
 * Handles the generation of files from stub templates.
 */
declare class StubGenerator implements IStubGenerator {
    /**
     * The directory containing the stub templates
     * @private
     */
    private stubsDir;
    /**
     * Creates a new StubGenerator instance
     *
     * @param {string} stubsDir - The directory containing the stub templates
     */
    constructor(stubsDir: string);
    /**
     * Generates a file from a stub template
     *
     * @param {string} stubName - The name of the stub template
     * @param {string} outputPath - The path where the generated file will be saved
     * @param {Record<string, string>} replacements - Map of placeholders to their replacements
     * @returns {boolean} True if the file was generated successfully, false otherwise
     */
    generate(stubName: string, outputPath: string, replacements: Record<string, string>): boolean;
    /**
     * Gets the list of available stub templates
     *
     * @returns {string[]} Array of stub template names
     */
    getAvailableStubs(): string[];
}

export { StubGenerator };
