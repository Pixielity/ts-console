import 'reflect-metadata'

/**
 * Metadata key for options
 */
export const OPTION_METADATA_KEY = Symbol('option')

/**
 * Option options interface
 */
export interface OptionOptions {
  /**
   * The flags for the option (e.g., "-n, --name")
   */
  flags: string

  /**
   * The description of the option
   */
  description?: string

  /**
   * The default value of the option
   */
  defaultValue?: any
}

/**
 * Option decorator
 *
 * Defines a command option
 *
 * @param {OptionOptions} options - The option options
 * @returns {PropertyDecorator} The property decorator
 */
export function Option(options: OptionOptions): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const metadata = {
      flags: options.flags,
      description: options.description || '',
      defaultValue: options.defaultValue,
      propertyKey,
    }

    // Get existing metadata or initialize empty array
    const existingMetadata = Reflect.getMetadata(OPTION_METADATA_KEY, target.constructor) || []

    // Add new metadata
    existingMetadata.push(metadata)

    // Update metadata
    Reflect.defineMetadata(OPTION_METADATA_KEY, existingMetadata, target.constructor)
  }
}
