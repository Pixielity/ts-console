import { Container } from 'inversify';
import { IServiceProvider, IConsoleApplication } from '@pixielity/ts-types';

/**
 * Console Service Provider
 *
 * Registers all console-related services in the container.
 */
declare class ConsoleServiceProvider implements IServiceProvider {
    /**
     * The IoC container instance
     * @protected
     */
    protected container: Container;
    /**
     * The commands directory path
     * @protected
     */
    protected commandsDir: string;
    /**
     * The stubs directory path
     * @protected
     */
    protected stubsDir: string;
    /**
     * Flag to track if services have been registered
     * @private
     */
    private registered;
    /**
     * Creates a new ConsoleServiceProvider instance
     *
     * @param {Container} container - The IoC container
     * @param {string} commandsDir - The directory containing commands
     * @param {string} stubsDir - The directory containing stubs
     */
    constructor(container: Container, commandsDir?: string, stubsDir?: string);
    /**
     * Register console services with the container
     */
    register(): void;
    /**
     * Helper method to bind an interface to an implementation if not already bound
     *
     * @param symbol - The interface symbol
     * @param constructor - The implementation constructor
     * @param constantValue - Optional constant value for toConstantValue bindings
     * @param singleton - Whether to use singleton scope (default: true)
     */
    private bindIfNotBound;
    /**
     * Bootstrap console services
     *
     * @returns {Promise<IConsoleApplication>} The application instance
     */
    boot(): Promise<IConsoleApplication>;
}

export { ConsoleServiceProvider };
