import {stringValidation} from "../../../core/validation";

export const postValidationMiddleware = [
    stringValidation({name: 'title', min: 1, max: 30}),
    stringValidation({name: 'shortDescription', min: 1, max: 100}),
    stringValidation({name: 'content', min: 1, max: 1000}),
]