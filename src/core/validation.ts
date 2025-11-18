import {body, param} from "express-validator";

export const validationMessages = {
    required: (type: 'field' | 'param') => `This ${type} is required`,
    url: "This field should be a url",
    stringField: "This field should be a string",
    numericString: "This field should be a numeric string",
    stringMaxLength: (length: number) => `This field should be be a maximum of ${length} characters long`,
    stringMinLength: (length: number) => `This field should be at least ${length} characters long`,
}
type StringValidation = { name: string, max?: number, min?: number }

export const stringValidation = ({name, max, min}: StringValidation) => {
    const scheme = body(name)
        .exists().withMessage(validationMessages.required('param'))
        .isString().withMessage(validationMessages.stringField);
    if (max) {
        scheme
            .isLength({max}).withMessage(validationMessages.stringMaxLength(max))
    }
    if (min) {
        scheme
            .trim()
            .isLength({min}).withMessage(validationMessages.stringMinLength(min))
    }
    return scheme;
}

export const idValidation = (props: { name?: string, type?: 'param' | 'body' } | undefined) => {
    const name = props?.name ?? 'id'
    const type = props?.type ?? 'param'
    let scheme = type === 'param' ? param(name) : body(name)
    return scheme
        .exists()
        .withMessage(validationMessages.required('param'))
        .isMongoId()
        .withMessage(`${name} should be a mongoId`)
}

export const urlValidation = (props: StringValidation) => stringValidation(props)
    .isURL().withMessage(validationMessages.url)
