import "reflect-metadata"
import { Container } from "inversify"
import { ConsoleServiceProvider } from "../src/providers/console-service-provider"
import { CommandRegistry } from "../src/command/command-registry"
import { StubGenerator } from "../src/stubs/stub-generator"
import { CommandScheduler } from "../src/scheduler/scheduler"
import * as path from "path"
import { jest } from "@jest/globals"
import { ICommandRegistry } from "@pixielity/ts-types"
import { IStubGenerator } from "@pixielity/ts-types"
import { ICommandScheduler } from "@pixielity/ts-types"
import { IConsoleApplication } from "@pixielity/ts-types"

// Mock the Application's discoverCommands method
jest.mock("../src/application", () => {
  const originalModule = jest.requireActual("../src/application")

  // Create a proper mock class that extends the original Application
  class MockApplication {
    discoverCommands = jest.fn().mockImplementation(() => {
      return Promise.resolve(this)
    })
    run = jest.fn()
  }

  return {
    __esModule: true,
    Application: MockApplication,
  }
})

describe("ConsoleServiceProvider", () => {
  let container: Container
  let provider: ConsoleServiceProvider
  const commandsDir = path.join(__dirname, "../src/commands")
  const stubsDir = path.join(__dirname, "../src/stubs/templates")

  beforeEach(() => {
    container = new Container()
    provider = new ConsoleServiceProvider(container, commandsDir, stubsDir)
  })

  test("should register services", () => {
    provider.register()

    expect(container.isBound(ICommandRegistry.$)).toBe(true)
    expect(container.isBound(ICommandScheduler.$)).toBe(true)
    expect(container.isBound(IConsoleApplication.$)).toBe(true)
    expect(container.isBound(IStubGenerator.$)).toBe(true)
    expect(container.isBound(IConsoleApplication.$)).toBe(true)

    // StubGenerator is bound as a constant value, so we need to check differently
    const stubGenerator = container.get(IStubGenerator.$)
    expect(stubGenerator).toBeInstanceOf(StubGenerator)
  })

  test("should boot and discover commands", async () => {
    provider.register()
    const app = await provider.boot()

    expect(app).toBeDefined()
    expect(app.discoverCommands).toHaveBeenCalledWith(commandsDir)
  })

  test("should not register services twice", () => {
    provider.register()

    // Create a spy on the container's bind method
    const bindSpy = jest.spyOn(container, "bind")

    // Register again
    provider.register()

    // Verify bind was not called again
    expect(bindSpy).not.toHaveBeenCalled()

    // Clean up
    bindSpy.mockRestore()
  })
})
