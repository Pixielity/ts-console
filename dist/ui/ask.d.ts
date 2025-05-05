import { IAsk, IQuestion } from '@pixielity/ts-types';

/**
 * Ask utility class
 *
 * Provides methods for asking questions in the console.
 */
declare class Ask implements IAsk {
    /**
     * Asks a single question
     *
     * @param {IQuestion} question - The question to ask
     * @returns {Promise<any>} The answer
     */
    question(question: IQuestion): Promise<any>;
    /**
     * Asks multiple questions
     *
     * @param {IQuestion[]} questions - The questions to ask
     * @returns {Promise<Record<string, any>>} The answers
     */
    questions(questions: IQuestion[]): Promise<Record<string, any>>;
    /**
     * Asks for input
     *
     * @param {string} message - The message to display
     * @param {string} defaultValue - The default value
     * @returns {Promise<string>} The input
     */
    input(message: string, defaultValue?: string): Promise<string>;
    /**
     * Asks for confirmation
     *
     * @param {string} message - The message to display
     * @param {boolean} defaultValue - The default value
     * @returns {Promise<boolean>} The confirmation
     */
    confirm(message: string, defaultValue?: boolean): Promise<boolean>;
    /**
     * Asks for a selection from a list
     *
     * @param {string} message - The message to display
     * @param {string[] | { name: string; value: any }[]} choices - The choices
     * @param {any} defaultValue - The default value
     * @returns {Promise<any>} The selection
     */
    select(message: string, choices: string[] | {
        name: string;
        value: any;
    }[], defaultValue?: any): Promise<any>;
    /**
     * Asks for multiple selections from a list
     *
     * @param {string} message - The message to display
     * @param {string[] | { name: string; value: any }[]} choices - The choices
     * @param {any[]} defaultValue - The default values
     * @returns {Promise<any[]>} The selections
     */
    multiSelect(message: string, choices: string[] | {
        name: string;
        value: any;
    }[], defaultValue?: any[]): Promise<any[]>;
    /**
     * Asks for a password
     *
     * @param {string} message - The message to display
     * @returns {Promise<string>} The password
     */
    password(message: string): Promise<string>;
    /**
     * Asks a single question
     *
     * @param {IQuestion} question - The question to ask
     * @returns {Promise<any>} The answer
     */
    static question(question: IQuestion): Promise<any>;
    /**
     * Asks multiple questions
     *
     * @param {IQuestion[]} questions - The questions to ask
     * @returns {Promise<Record<string, any>>} The answers
     */
    static questions(questions: IQuestion[]): Promise<Record<string, any>>;
    /**
     * Asks for input
     *
     * @param {string} message - The message to display
     * @param {string} defaultValue - The default value
     * @returns {Promise<string>} The input
     */
    static input(message: string, defaultValue?: string): Promise<string>;
    /**
     * Asks for confirmation
     *
     * @param {string} message - The message to display
     * @param {boolean} defaultValue - The default value
     * @returns {Promise<boolean>} The confirmation
     */
    static confirm(message: string, defaultValue?: boolean): Promise<boolean>;
    /**
     * Asks for a selection from a list
     *
     * @param {string} message - The message to display
     * @param {string[] | { name: string; value: any }[]} choices - The choices
     * @param {any} defaultValue - The default value
     * @returns {Promise<any>} The selection
     */
    static select(message: string, choices: string[] | {
        name: string;
        value: any;
    }[], defaultValue?: any): Promise<any>;
    /**
     * Asks for multiple selections from a list
     *
     * @param {string} message - The message to display
     * @param {string[] | { name: string; value: any }[]} choices - The choices
     * @param {any[]} defaultValue - The default values
     * @returns {Promise<any[]>} The selections
     */
    static multiSelect(message: string, choices: string[] | {
        name: string;
        value: any;
    }[], defaultValue?: any[]): Promise<any[]>;
    /**
     * Asks for a password
     *
     * @param {string} message - The message to display
     * @returns {Promise<string>} The password
     */
    static password(message: string): Promise<string>;
}

export { Ask };
