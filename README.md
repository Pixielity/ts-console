# Next.js Console Package

A Laravel/Symfony-inspired console package for Next.js applications.

## Overview

This package provides a command-line interface for Next.js applications, similar to the console components in Laravel and Symfony. It allows you to create and run custom commands, generate files from templates, schedule commands, and more.

## Installation

\`\`\`bash
npm install @your-org/console
\`\`\`

## Usage

### Creating a Console Application

\`\`\`typescript
import { Application } from '@your-org/console';
import { MakeCommand } from '@your-org/console/commands/make-command';

// Create a new console application
const app = new Application('My App', '1.0.0');

// Register commands
app.register(new MakeCommand());

// Run the application
app.run().catch(error => {
  console.error(`Fatal error: ${error.message}`);
  process.exit(1);
});
\`\`\`

### Creating a Custom Command

\`\`\`typescript
import { BaseCommand } from '@your-org/console';
import { Command } from '@your-org/console/decorators/command.decorator';
import { Argument } from '@your-org/console/decorators/argument.decorator';
import { Option } from '@your-org/console/decorators/option.decorator';

@Command({
  name: 'hello',
  description: 'Say hello to someone'
})
export class HelloCommand extends BaseCommand {
  @Argument({
    name: 'name',
    description: 'The name to greet',
    required: false
  })
  private name!: string;

  @Option({
    flags: '-u, --uppercase',
    description: 'Convert the greeting to uppercase'
  })
  private uppercase!: boolean;

  public async execute(context: any): Promise<number> {
    const name = context.arguments[0] || this.name || 'World';
    const uppercase = context.options.uppercase || this.uppercase || false;
    
    let greeting = `Hello, ${name}!`;
    
    if (uppercase) {
      greeting = greeting.toUpperCase();
    }
    
    this.line(greeting);
    return 0;
  }
}
\`\`\`

### Running Commands

\`\`\`bash
# Run the hello command
node console.js hello John

# Get help
node console.js help hello

# List all commands
node console.js list
\`\`\`

### Integrating with Next.js

Create a file at `src/lib/console.ts`:

\`\`\`typescript
import { initConsole, getScheduler } from '@your-org/console/next';
import path from 'path';

// Initialize the console
export const initializeConsole = async () => {
  const app = await initConsole(
    path.join(process.cwd(), 'src/commands'),
    path.join(process.cwd(), 'src/stubs')
  );
  
  // Get the scheduler
  const scheduler = getScheduler();
  
  // Schedule commands
  scheduler.schedule('cache:clear', { hour: '0' }); // Run at midnight
  
  // Start the scheduler
  scheduler.start();
  
  return { app, scheduler };
};
\`\`\`

Then, in your `src/app/api/cron/route.ts` file:

\`\`\`typescript
import { NextResponse } from 'next/server';
import { initializeConsole } from '@/lib/console';

// Initialize console when the API route is first accessed
let initialized = false;

export async function GET() {
  if (!initialized) {
    await initializeConsole();
    initialized = true;
  }
  
  return NextResponse.json({ status: 'Console initialized' });
}
\`\`\`

## Features

- Command registration and discovery
- Input/output handling
- Stub template generation
- Command scheduling
- Command lifecycle hooks (beforeExecute, afterExecute)
- Built-in commands (make:command, help, list, schedule)
- Dependency injection with Inversify
- Extensible architecture

## License

MIT
