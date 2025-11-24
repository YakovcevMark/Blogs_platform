import {emailValidation, stringValidation} from "../../../core/validation";
import {usersQueryRepository} from "../repositories/query-repo";

export const userValidationMiddleware = [
    stringValidation({
        name: 'login',
        min: 3,
        max: 10
    })
        .matches(/^[a-zA-Z0-9_-]*$/)
        .withMessage('The login field should mathe the pattern: ^[a-zA-Z0-9_-]*$')
        .custom(
            async (value) => {
                const result = await usersQueryRepository.getCount({searchLoginTerm: value})
                return result > 0
            })
        .withMessage('User with that login already exists'),
    emailValidation({name: 'email', min: 1}),
    stringValidation({name: 'password', min: 6, max: 20})
]