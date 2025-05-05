#!/usr/bin/env node

import type { IConsoleApplication } from '@pixielity/ts-types'

require('reflect-metadata')
const path = require('path')
const { container } = require('../src/di/container')
const { ConsoleServiceProvider } = require('../src/providers/console-service-provider')

async function bootstrap() {
  try {
    // Create and register the console service provider
    const commandsDir = path.join(process.cwd(), 'src/commands')
    const stubsDir = path.join(process.cwd(), 'src/stubs/templates')

    const provider = new ConsoleServiceProvider(container, commandsDir, stubsDir)

    // Register services
    provider.register()

    // Boot the provider
    const app: IConsoleApplication = await provider.boot()

    // Run the application with all arguments
    // This ensures the command name is properly passed
    await app.run(process.argv)
  } catch (error) {
    console.error('Bootstrap error:', error)
    process.exit(1)
  }
}

// Run the bootstrap function
bootstrap().catch((error) => {
  console.error('Unhandled error:', error)
  process.exit(1)
})
