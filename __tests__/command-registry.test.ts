import "reflect-metadata"
import { CommandRegistry } from "../src/command/command-registry"
import type { ICommand } from "@pixielity/ts-types"

/**
 * Mock command for testing
 */
const createMockCommand = (name: string): ICommand => ({
  getName: () => name,
  getDescription: () => `Description for ${name}`,
  configure: () => {},
  execute: async () => 0,
  setInput: () => {},
  getInput: () => ({
    getCommandName: () => "",
    getArgument: () => "",
    getArguments: () => ({}),
    getOption: () => "",
    getOptions: () => ({}),
    hasOption: () => false,
  }),
  setOutput: () => {},
  getOutput: () => ({
    write: () => {},
    writeln: () => {},
    error: () => {},
    success: () => {},
    info: () => {},
    warning: () => {},
    comment: () => {},
  }),
  setArguments: () => {},
  setOptions: () => {},
})

describe("CommandRegistry", () => {
  let registry: CommandRegistry
  let mockCommand: ICommand

  beforeEach(() => {
    registry = new CommandRegistry()
    mockCommand = createMockCommand("test")
  })

  test("should add a command", () => {
    registry.add(mockCommand)
    expect(registry.has("test")).toBe(true)
    expect(registry.get("test")).toBe(mockCommand)
  })

  test("should throw when adding a duplicate command", () => {
    registry.add(mockCommand)
    expect(() => registry.add(mockCommand)).toThrow()
  })

  test("should get all commands", () => {
    const command1 = createMockCommand("test1")
    const command2 = createMockCommand("test2")

    registry.add(command1)
    registry.add(command2)

    const commands = registry.getAll()

    expect(commands).toHaveLength(2)
    expect(commands).toContain(command1)
    expect(commands).toContain(command2)
  })

  test("should remove a command", () => {
    registry.add(mockCommand)
    expect(registry.has("test")).toBe(true)

    const removed = registry.remove("test")

    expect(removed).toBe(true)
    expect(registry.has("test")).toBe(false)
    expect(registry.get("test")).toBeUndefined()
  })

  test("should clear all commands", () => {
    registry.add(createMockCommand("test1"))
    registry.add(createMockCommand("test2"))

    expect(registry.getAll()).toHaveLength(2)

    registry.clear()

    expect(registry.getAll()).toHaveLength(0)
  })
})
