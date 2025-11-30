import {stringValidation} from "../../../core/validation";

export const commentValidationMiddleware = [
    stringValidation({
        name: 'content',
        min: 20,
        max: 300
    })
]