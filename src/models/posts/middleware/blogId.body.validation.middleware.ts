import {idValidation} from "../../../core/validation";

export const blogIdBodyValidation = [
    idValidation({name: 'blogId', type: 'body'}),
]