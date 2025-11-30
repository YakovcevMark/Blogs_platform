import {idValidation} from "../../../core/validation";

export const postIdParamValidation = [
    idValidation({name: 'postId', type: 'param'}),
]
