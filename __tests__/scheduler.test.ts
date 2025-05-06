import 'reflect-metadata'
import { CommandScheduler } from '../src/scheduler/scheduler'
import { CommandRegistry } from '../src/command/command-registry'
import { BaseCommand } from '../src/command/base-command'
import { jest } from '@jest/globals'

/**
 * Mock command for testing
 */
class MockCommand extends BaseCommand {
  /**
   * Flag to track if the command was executed
   */
  public executed = false

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
}

describe('CommandScheduler', () => {
  let registry: CommandRegistry
  let scheduler: CommandScheduler
  let mockCommand: MockCommand

  beforeEach(() => {
    // Create registry and scheduler directly without container
    registry = new CommandRegistry()

    // Create and register mock command
    mockCommand = new MockCommand()
    registry.add(mockCommand)

    // Create scheduler with the registry
    scheduler = new CommandScheduler(registry)
  })

  test('should schedule a command', () => {
    // Verify the command is in the registry
    expect(registry.has('mock')).toBe(true)

    scheduler.schedule('mock', { minute: '0' })

    const tasks = scheduler.getTasks()
    expect(tasks).toHaveLength(1)
    expect(tasks[0].command).toBe(mockCommand)
  })

  test('should throw when scheduling a non-existent command', () => {
    expect(() => scheduler.schedule('unknown', { minute: '0' })).toThrow()
  })

  test('should clear tasks', () => {
    // Verify the command is in the registry
    expect(registry.has('mock')).toBe(true)

    scheduler.schedule('mock', { minute: '0' })
    expect(scheduler.getTasks()).toHaveLength(1)

    scheduler.clearTasks()
    expect(scheduler.getTasks()).toHaveLength(0)
  })

  test('should start and stop the scheduler', () => {
    // Mock setInterval and clearInterval
    const originalSetInterval = global.setInterval
    const originalClearInterval = global.clearInterval

    // @ts-ignore
    global.setInterval = jest.fn().mockReturnValue(123)
    global.clearInterval = jest.fn()

    scheduler.start()
    expect(global.setInterval).toHaveBeenCalled()

    scheduler.stop()
    expect(global.clearInterval).toHaveBeenCalledWith(123)

    // Restore original functions
    global.setInterval = originalSetInterval
    global.clearInterval = originalClearInterval
  })
})
