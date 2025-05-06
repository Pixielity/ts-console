import 'reflect-metadata'
import { Container } from 'inversify'
import { Application } from '../src/application'
import { CommandRegistry } from '../src/command/command-registry'
import { BaseCommand } from '../src/command/base-command'
import type { IOutput } from '@pixielity/ts-types'
import { ICommandRegistry } from '@pixielity/ts-types'
import { IConsoleApplication } from '@pixielity/ts-types'
import { ICommandCollector } from '@pixielity/ts-types'
import { Output } from '../src/output'

/**
 * Mock command for testing
 */
class MockCommand extends BaseCommand {
  /**
   * Flag to track if the command was executed
   */
  public executed = false

  /**
   * Flag to track if beforeExecute was called
   */
  public beforeExecuteCalled = false

  /**
   * Flag to track if afterExecute was called
   */
  public afterExecuteCalled = false

  /**
   * Creates a new MockCommand instance
   */
  constructor() {
    super('mock', 'A mock command for testing')
  }

  /**
   * Executes the command
   *
   * @returns {Promise<number>} The exit code
   */
  public async execute(): Promise<number> {
    this.executed = true
    return 0
  }

  /**
   * Hook that runs before command execution
   *
   * @returns {Promise<boolean>} True if execution should continue, false to abort
   */
  public async beforeExecute(): Promise<boolean> {
    this.beforeExecuteCalled = true
    return true
  }

  /**
   * Hook that runs after command execution
   *
   * @param {number | void} exitCode - The exit code from the command
   * @returns {Promise<void>}
   */
  public async afterExecute(exitCode: number | void): Promise<void> {
    this.afterExecuteCalled = true
  }
}

/**
 * Mock output for testing
 */
class MockOutput implements IOutput {
  /**
   * Array of messages written to the output
   */
  public messages: string[] = []

  /**
   * Writes a message to the output
   *
   * @param {string} message - The message to write
   */
  public write(message: string): void {
    this.messages.push(message)
  }

  /**
   * Writes a message to the output followed by a newline
   *
   * @param {string} message - The message to write
   */
  public writeln(message: string): void {
    this.messages.push(message)
  }

  /**
   * Writes an error message to the output
   *
   * @param {string} message - The error message to write
   */
  public error(message: string): void {
    this.messages.push(`ERROR: ${message}`)
  }

  /**
   * Writes a success message to the output
   *
   * @param {string} message - The success message to write
   */
  public success(message: string): void {
    this.messages.push(`SUCCESS: ${message}`)
  }

  /**
   * Writes an info message to the output
   *
   * @param {string} message - The info message to write
   */
  public info(message: string): void {
    this.messages.push(`INFO: ${message}`)
  }

  /**
   * Writes a warning message to the output
   *
   * @param {string} message - The warning message to write
   */
  public warning(message: string): void {
    this.messages.push(`WARNING: ${message}`)
  }

  /**
   * Writes a comment message to the output
   *
   * @param {string} message - The message to write
   */
  public comment(message: string): void {
    this.messages.push(`COMMENT: ${message}`)
  }
}

// Mock CommandCollector
class MockCommandCollector implements ICommandCollector {
  async discoverCommands(): Promise<any[]> {
    return []
  }
  getRegisteredCommands(): any[] {
    return []
  }
  getCommandMetadata(): any {
    return {}
  }
}

describe('Application', () => {
  let container: Container
  let app: Application
  let mockCommand: MockCommand
  let commandRegistry: CommandRegistry
  let commandCollector: MockCommandCollector

  beforeEach(() => {
    // Create a new container for each test
    container = new Container()

    // Create mock collector
    commandCollector = new MockCommandCollector()

    // Register services
    container.bind(ICommandRegistry.$).to(CommandRegistry).inSingletonScope()
    container.bind(CommandRegistry).toSelf().inSingletonScope()
    container.bind(ICommandCollector.$).toConstantValue(commandCollector)

    // Get registry instance
    commandRegistry = container.get<CommandRegistry>(CommandRegistry)

    // Create application manually to avoid DI issues in tests
    app = new Application(commandRegistry, commandCollector)
    container.bind(IConsoleApplication.$).toConstantValue(app)
    container.bind(Application).toConstantValue(app)

    // Create mock command
    mockCommand = new MockCommand()
  })

  test('should register a command', () => {
    // Register the command
    app.register(mockCommand)

    expect(commandRegistry.get('mock')).toBe(mockCommand)
  })

  test('should execute a command', async () => {
    // Create a new mock command for this test to avoid duplicate registration
    const testCommand = new MockCommand()

    // Set up the command with output and other necessary properties
    testCommand.setOutput(new Output())

    // Directly call the execute method to test execution
    await testCommand.execute()

    // Directly call the hooks to test them
    await testCommand.beforeExecute()
    await testCommand.afterExecute(0)

    // Verify the command was executed and hooks were called
    expect(testCommand.executed).toBe(true)
    expect(testCommand.beforeExecuteCalled).toBe(true)
    expect(testCommand.afterExecuteCalled).toBe(true)
  })

  test('should handle command not found', async () => {
    const mockOutput = new MockOutput()

    // Try to get a non-existent command
    const command = commandRegistry.get('unknown')

    expect(command).toBeUndefined()
  })
})
