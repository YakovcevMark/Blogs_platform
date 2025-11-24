/**
 * @property {string} login - maxLength: 10
 * minLength: 3
 * pattern: ^[a-zA-Z0-9_-]*$
 * must be unique.
 * @property {string} password - maxLength: 20
 * minLength: 6.
 * @property {string} email - pattern: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
 * example: example@example.com
 * must be unique.
 */
export type UserInputModel = {
    login: string
    password: string
    email: string
}