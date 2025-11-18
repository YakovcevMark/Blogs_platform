import {idValidation} from "../../../core/validation";

export const blogIdParamValidation = [
    idValidation({name: 'blogId', type: 'param'}),
]
