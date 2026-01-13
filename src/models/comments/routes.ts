import {Router} from "express";
import {inputValidationResultMiddleware} from "../../middleware/input-validation-result-middleware";
import {authMiddleware} from "../../middleware/auth-middleware";
import {enumValidation, idValidation} from "../../core/validation";
import {commentValidationMiddleware} from "./validation/comment.dto.validation";
import {deleteCommentHandler} from "./handlers/delete";
import {getCommentByIdHandler} from "./handlers/getById";
import {updateCommentHandler} from "./handlers/patch";
import {LikeStatus} from "../../core/enums/like.status.enum";
import {changeCommentLikeStatusHandler} from "./handlers/change-like-status";
import {notNecessaryAuthTokenCheckingMiddleware} from "../../middleware/not-necessary-auth-token-checking-middleware";


const commentsRouter = Router()

commentsRouter.get('/:id',
    notNecessaryAuthTokenCheckingMiddleware,
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
commentsRouter.put('/:commentId/like-status',
    authMiddleware,
    idValidation({name: 'commentId', type: 'param'}),
    enumValidation('likeStatus', LikeStatus),
    inputValidationResultMiddleware,
    changeCommentLikeStatusHandler,
)


export {commentsRouter};