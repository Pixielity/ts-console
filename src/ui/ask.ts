import inquirer from 'inquirer'
import { injectable } from 'inversify'
import type { IAsk } from '@pixielity/ts-types'
import type { IQuestion } from '@pixielity/ts-types'
import { QuestionType } from '@pixielity/ts-types'

/**
 * Ask utility class
 *
 * Provides methods for asking questions in the console.
 */
@injectable()
export class Ask implements IAsk {
  /**
   * Asks a single question
   *
   * @param {IQuestion} question - The question to ask
   * @returns {Promise<any>} The answer
   */
  public async question(question: IQuestion): Promise<any> {
    return Ask.question(question)
  }

  /**
   * Asks multiple questions
   *
   * @param {IQuestion[]} questions - The questions to ask
   * @returns {Promise<Record<string, any>>} The answers
   */
  public async questions(questions: IQuestion[]): Promise<Record<string, any>> {
    return Ask.questions(questions)
  }

  /**
   * Asks for input
   *
   * @param {string} message - The message to display
   * @param {string} defaultValue - The default value
   * @returns {Promise<string>} The input
   */
  public async input(message: string, defaultValue?: string): Promise<string> {
    return Ask.input(message, defaultValue)
  }

  /**
   * Asks for confirmation
   *
   * @param {string} message - The message to display
   * @param {boolean} defaultValue - The default value
   * @returns {Promise<boolean>} The confirmation
   */
  public async confirm(message: string, defaultValue = false): Promise<boolean> {
    return Ask.confirm(message, defaultValue)
  }

  /**
   * Asks for a selection from a list
   *
   * @param {string} message - The message to display
   * @param {string[] | { name: string; value: any }[]} choices - The choices
   * @param {any} defaultValue - The default value
   * @returns {Promise<any>} The selection
   */
  public async select(
    message: string,
    choices: string[] | { name: string; value: any }[],
    defaultValue?: any,
  ): Promise<any> {
    return Ask.select(message, choices, defaultValue)
  }

  /**
   * Asks for multiple selections from a list
   *
   * @param {string} message - The message to display
   * @param {string[] | { name: string; value: any }[]} choices - The choices
   * @param {any[]} defaultValue - The default values
   * @returns {Promise<any[]>} The selections
   */
  public async multiSelect(
    message: string,
    choices: string[] | { name: string; value: any }[],
    defaultValue?: any[],
  ): Promise<any[]> {
    return Ask.multiSelect(message, choices, defaultValue)
  }

  /**
   * Asks for a password
   *
   * @param {string} message - The message to display
   * @returns {Promise<string>} The password
   */
  public async password(message: string): Promise<string> {
    return Ask.password(message)
  }

  /**
   * Asks a single question
   *
   * @param {IQuestion} question - The question to ask
   * @returns {Promise<any>} The answer
   */
  public static async question(question: IQuestion): Promise<any> {
    const answers = await inquirer.prompt([question])
    return answers[question.name]
  }

  /**
   * Asks multiple questions
   *
   * @param {IQuestion[]} questions - The questions to ask
   * @returns {Promise<Record<string, any>>} The answers
   */
  public static async questions(questions: IQuestion[]): Promise<Record<string, any>> {
    return inquirer.prompt(questions)
  }

  /**
   * Asks for input
   *
   * @param {string} message - The message to display
   * @param {string} defaultValue - The default value
   * @returns {Promise<string>} The input
   */
  public static async input(message: string, defaultValue?: string): Promise<string> {
    return Ask.question({
      type: QuestionType.Input,
      name: 'input',
      message,
      default: defaultValue,
    })
  }

  /**
   * Asks for confirmation
   *
   * @param {string} message - The message to display
   * @param {boolean} defaultValue - The default value
   * @returns {Promise<boolean>} The confirmation
   */
  public static async confirm(message: string, defaultValue = false): Promise<boolean> {
    return Ask.question({
      type: QuestionType.Confirm,
      name: 'confirm',
      message,
      default: defaultValue,
    })
  }

  /**
   * Asks for a selection from a list
   *
   * @param {string} message - The message to display
   * @param {string[] | { name: string; value: any }[]} choices - The choices
   * @param {any} defaultValue - The default value
   * @returns {Promise<any>} The selection
   */
  public static async select(
    message: string,
    choices: string[] | { name: string; value: any }[],
    defaultValue?: any,
  ): Promise<any> {
    return Ask.question({
      type: QuestionType.List,
      name: 'select',
      message,
      choices,
      default: defaultValue,
    })
  }

  /**
   * Asks for multiple selections from a list
   *
   * @param {string} message - The message to display
   * @param {string[] | { name: string; value: any }[]} choices - The choices
   * @param {any[]} defaultValue - The default values
   * @returns {Promise<any[]>} The selections
   */
  public static async multiSelect(
    message: string,
    choices: string[] | { name: string; value: any }[],
    defaultValue?: any[],
  ): Promise<any[]> {
    return Ask.question({
      type: QuestionType.Checkbox,
      name: 'multiSelect',
      message,
      choices,
      default: defaultValue,
    })
  }

  /**
   * Asks for a password
   *
   * @param {string} message - The message to display
   * @returns {Promise<string>} The password
   */
  public static async password(message: string): Promise<string> {
    return Ask.question({
      type: QuestionType.Password,
      name: 'password',
      message,
    })
  }
}
