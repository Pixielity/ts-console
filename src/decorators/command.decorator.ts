import 'reflect-metadata'
import { injectable } from 'inversify'
import { ICommand, ICommandOptions } from '@pixielity/ts-types'

import { container } from '../di/container'

/**
 * Metadata key for command
 */
export const COMMAND_METADATA_KEY = Symbol('command')

/**
 * Command decorator
 *
 * Marks a class as a console command and registers it with the container
 *
 * @param {CommandOptions} options - The command options
 * @returns {ClassDecorator} The class decorator
 */
export function Command(options: ICommandOptions): ClassDecorator {
  return (target: Function): void => {
    // Set default values for options
    const commandOptions = {
      ...options,
      hidden: options.hidden ?? false,
      injectable: options.injectable ?? true,
      description: options.description || '',
      shortcuts: options.shortcuts || [],
    }

    // Store command metadata with defaults applied
    Reflect.defineMetadata(COMMAND_METADATA_KEY, commandOptions, target)

    // Make the class injectable if not explicitly disabled
    if (commandOptions.injectable) {
      injectable()(target)

      // Register the command with the container
      // We use a multi-injection approach for commands
      try {
        container
          .bind(ICommand.$)
          .to(target as any)
          .inSingletonScope()
      } catch (error) {
        // If the binding already exists, we can ignore the error
        // This can happen during hot reloading
      }
    }
  }
}
