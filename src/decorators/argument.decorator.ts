import 'reflect-metadata'

/**
 * Metadata key for arguments
 */
export const ARGUMENT_METADATA_KEY = Symbol('argument')

/**
 * Argument options interface
 */
export interface ArgumentOptions {
  /**
   * The name of the argument
   */
  name: string

  /**
   * The description of the argument
   */
  description?: string

  /**
   * The default value of the argument
   */
  defaultValue?: any

  /**
   * Whether the argument is required
   */
  required?: boolean

  /**
   * Whether the argument is an array (variadic)
   */
  isArray?: boolean
}

/**
 * Argument decorator
 *
 * Defines a command argument
 *
 * @param {ArgumentOptions} options - The argument options
 * @returns {PropertyDecorator} The property decorator
 */
export function Argument(options: ArgumentOptions): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    // Format the argument name for Commander
    // If it's required, don't add brackets
    // If it's an array, add ellipsis
    let name = options.name
    if (!options.required) {
      name = `[${name}]`
    } else {
      name = `<${name}>`
    }

    if (options.isArray) {
      name = `${name}...`
    }

    const metadata = {
      name,
      description: options.description || '',
      defaultValue: options.defaultValue,
      propertyKey,
    }

    // Get existing metadata or initialize empty array
    const existingMetadata = Reflect.getMetadata(ARGUMENT_METADATA_KEY, target.constructor) || []

    // Add new metadata
    existingMetadata.push(metadata)

    // Update metadata
    Reflect.defineMetadata(ARGUMENT_METADATA_KEY, existingMetadata, target.constructor)
  }
}
