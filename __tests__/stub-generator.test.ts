import * as fs from "fs"
import * as path from "path"
import { StubGenerator } from "../src/stubs/stub-generator"
import { jest } from "@jest/globals"

// Mock fs module
jest.mock("fs", () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn(),
  readdirSync: jest.fn(),
}))

describe("StubGenerator", () => {
  let stubGenerator: StubGenerator
  const stubsDir = "/path/to/stubs"

  beforeEach(() => {
    stubGenerator = new StubGenerator(stubsDir)
    jest.clearAllMocks()
  })

  test("should generate a file from a stub", () => {
    // Mock file existence
    ;(fs.existsSync as jest.Mock).mockImplementation((path) => {
      // Return true for stub file, false for output directory
      return path === `${stubsDir}/test.stub`
    })

    // Mock stub content
    ;(fs.readFileSync as jest.Mock).mockReturnValue("Hello {{name}}!")

    // Call generate
    const result = stubGenerator.generate("test", "/output/path.ts", { name: "World" })

    // Verify result
    expect(result).toBe(true)

    // Verify fs calls
    expect(fs.existsSync).toHaveBeenCalledWith(path.join(stubsDir, "test.stub"))
    expect(fs.readFileSync).toHaveBeenCalledWith(path.join(stubsDir, "test.stub"), "utf8")
    expect(fs.mkdirSync).toHaveBeenCalledWith("/output", { recursive: true })
    expect(fs.writeFileSync).toHaveBeenCalledWith("/output/path.ts", "Hello World!")
  })

  test("should handle missing stub file", () => {
    // Mock file non-existence
    ;(fs.existsSync as jest.Mock).mockReturnValue(false)

    // Mock console.error
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {})

    // Call generate
    const result = stubGenerator.generate("missing", "/output/path.ts", {})

    // Verify result
    expect(result).toBe(false)

    // Verify console.error was called
    expect(consoleErrorSpy).toHaveBeenCalled()

    // Restore console.error
    consoleErrorSpy.mockRestore()
  })

  test("should get available stubs", () => {
    // Mock directory contents
    ;(fs.readdirSync as jest.Mock).mockReturnValue(["test1.stub", "test2.stub", "not-a-stub.txt"])

    // Call getAvailableStubs
    const stubs = stubGenerator.getAvailableStubs()

    // Verify result
    expect(stubs).toEqual(["test1", "test2"])

    // Verify fs calls
    expect(fs.readdirSync).toHaveBeenCalledWith(stubsDir)
  })

  test("should handle error when getting available stubs", () => {
    // Mock directory read error
    ;(fs.readdirSync as jest.Mock).mockImplementation(() => {
      throw new Error("Directory not found")
    })

    // Mock console.error
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {})

    // Call getAvailableStubs
    const stubs = stubGenerator.getAvailableStubs()

    // Verify result
    expect(stubs).toEqual([])

    // Verify console.error was called
    expect(consoleErrorSpy).toHaveBeenCalled()

    // Restore console.error
    consoleErrorSpy.mockRestore()
  })
})
