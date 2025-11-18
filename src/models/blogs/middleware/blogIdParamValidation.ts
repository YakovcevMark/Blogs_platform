import {validationMessages} from "../../../core/validation";
import {param} from "express-validator";

export const blogIdParamValidation = [
    param('blogId').exists().withMessage(validationMessages.required('param'))
]
