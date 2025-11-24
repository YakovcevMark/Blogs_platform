import {stringValidation} from "../../../core/validation";

export const loginValidationMiddleware = [
    stringValidation({
        name: 'loginOrEmail',
        min: 1,
        max: 20
    }),
    stringValidation({name: 'password', min: 6, max: 20})
]