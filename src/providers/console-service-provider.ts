import type { Container } from 'inversify'
import * as path from 'path'
import type { IContainer, IServiceProvider } from '@pixielity/ts-types'
import { CommandRegistry } from '../command/command-registry'
import { StubGenerator } from '../stubs/stub-generator'
import { CommandScheduler } from '../scheduler/scheduler'
import { Application } from '../application'
import { ICommandRegistry } from '@pixielity/ts-types'
import { IStubGenerator } from '@pixielity/ts-types'
import { ICommandScheduler } from '@pixielity/ts-types'
import { IConsoleApplication } from '@pixielity/ts-types'
import { ITableOutput } from '@pixielity/ts-types'
import { TableOutput } from '../ui/table'
import { IProgressBar } from '@pixielity/ts-types'
import { ProgressBar } from '../ui/progress-bar'
import { IAsk } from '@pixielity/ts-types'
import { Ask } from '../ui/ask'
import { ICommandCollector } from '@pixielity/ts-types'
import { CommandCollector } from '../discovery/command-collector'

/**
 * Console Service Provider
 *
 * Registers all console-related services in the container.
 */
export class ConsoleServiceProvider implements IServiceProvider {
  /**
   * The IoC container instance
   * @protected
   */
  public app: IContainer

  /**
   * The commands directory path
   * @protected
   */
  protected commandsDir: string

  /**
   * The stubs directory path
   * @protected
   */
  protected stubsDir: string

  /**
   * Flag to track if services have been registered
   * @private
   */
  private registered = false

  /**
   * Creates a new ConsoleServiceProvider instance
   *
   * @param {IContainer} container - The IoC container
   * @param {string} commandsDir - The directory containing commands
   * @param {string} stubsDir - The directory containing stubs
   */
  constructor(
    container: IContainer,
    commandsDir = path.join(process.cwd(), 'src/commands'),
    stubsDir = path.join(process.cwd(), 'src/stubs/templates'),
  ) {
    this.app = container
    this.stubsDir = stubsDir
    this.commandsDir = commandsDir
  }

  /**
   * Register console services with the container
   */
  public register(): void {
    // Skip if already registered
    if (this.registered) {
      return
    }

    // Register core services with their interfaces
    this.bindIfNotBound(IConsoleApplication.$, Application)
    this.bindIfNotBound(ICommandRegistry.$, CommandRegistry)
    this.bindIfNotBound(ICommandScheduler.$, CommandScheduler)
    this.bindIfNotBound(IStubGenerator.$, StubGenerator, new StubGenerator(this.stubsDir))

    // Register utility services
    this.bindIfNotBound(ITableOutput.$, TableOutput, null, false) // Transient
    this.bindIfNotBound(IProgressBar.$, ProgressBar, null, false) // Transient

    // Register static services
    this.bindIfNotBound(IAsk.$, null, Ask)
    this.bindIfNotBound(ICommandCollector.$, CommandCollector)

    // Mark as registered
    this.registered = true
  }

  /**
   * Helper method to bind an interface to an implementation if not already bound
   *
   * @param symbol - The interface symbol
   * @param constructor - The implementation constructor
   * @param constantValue - Optional constant value for toConstantValue bindings
   * @param singleton - Whether to use singleton scope (default: true)
   */
  private bindIfNotBound(
    symbol: symbol,
    constructor: any,
    constantValue?: any,
    singleton = true,
  ): void {
    if (!this.app.isBound(symbol)) {
      if (constantValue) {
        this.app.bind(symbol).toConstantValue(constantValue)
      } else if (singleton) {
        this.app.bind(symbol).to(constructor).inSingletonScope()
      } else {
        this.app.bind(symbol).to(constructor)
      }
    }
  }

  /**
   * Bootstrap console services
   *
   * @returns {Promise<IConsoleApplication>} The application instance
   */
  public async boot(): Promise<IConsoleApplication> {
    // Get the application from the container using the interface
    const app = this.app.make<IConsoleApplication>(IConsoleApplication.$)

    // Discover commands
    await app.discoverCommands(this.commandsDir)

    return app
  }
}
