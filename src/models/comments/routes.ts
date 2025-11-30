import {Router} from "express";
import {inputValidationResultMiddleware} from "../../middleware/input-validation-result-middleware";
import {authMiddleware} from "../../middleware/auth-middleware";
import {idValidation} from "../../core/validation";
import {commentValidationMiddleware} from "./validation/comment.dto.validation";
import {deleteCommentHandler} from "./handlers/delete";
import {getCommentByIdHandler} from "./handlers/getById";
import {updateCommentHandler} from "./handlers/patch";


const commentsRouter = Router()

commentsRouter.get('/:id',
    idValidation({name: 'id', type: 'param'}),
    inputValidationResultMiddleware,
    getCommentByIdHandler,
)


commentsRouter.put('/:commentId',
    authMiddleware,
    idValidation({name: 'commentId', type: 'param'}),
    commentValidationMiddleware,
    inputValidationResultMiddleware,
    updateCommentHandler,
)


commentsRouter.delete('/:commentId',
    authMiddleware,
    idValidation({name: 'commentId', type: 'param'}),
    inputValidationResultMiddleware,
    deleteCommentHandler,
)


export {commentsRouter};