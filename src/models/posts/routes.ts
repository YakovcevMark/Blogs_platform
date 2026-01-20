import {Router} from "express";
import {getPostsHandler} from "./handlers/get";
import {getPostByIdHandler} from "./handlers/get-by-id";
import {createPostHandler} from "./handlers/post";
import {updatePostHandler} from "./handlers/put";
import {deletePostHandler} from "./handlers/delete";
import {postValidationMiddleware} from "./validation/post.dto.validation";
import {inputValidationResultMiddleware} from "../../middleware/input-validation-result-middleware";
import {authMiddleware} from "../../middleware/auth-middleware";
import {postsQueryMiddleware} from "./middleware/posts.query.middleware";
import {blogIdBodyValidation} from "./middleware/blogId.body.validation.middleware";
import {enumValidation, idValidation} from "../../core/validation";
import {commentsQueryMiddleware} from "../comments/middleware/comments.query.middleware";
import {getCommentsHandler} from "../comments/handlers/get";
import {commentValidationMiddleware} from "../comments/validation/comment.dto.validation";
import {createCommentHandler} from "../comments/handlers/post";
import {superAdminGuardMiddleware} from "../../middleware/super-admin-guard-middleware";
import {notNecessaryAuthTokenCheckingMiddleware} from "../../middleware/not-necessary-auth-token-checking-middleware";
import {LikeStatus} from "../../core/enums/like.status.enum";
import {changePostLikeStatusHandler} from "./handlers/change-like-status";

const postsRouter = Router()

postsRouter.get('', notNecessaryAuthTokenCheckingMiddleware, postsQueryMiddleware, inputValidationResultMiddleware, getPostsHandler)
postsRouter.get('/:id', notNecessaryAuthTokenCheckingMiddleware,  idValidation({name: 'id', type: 'param'}), getPostByIdHandler)
postsRouter.post('', notNecessaryAuthTokenCheckingMiddleware, superAdminGuardMiddleware, postValidationMiddleware, blogIdBodyValidation, inputValidationResultMiddleware, createPostHandler)
postsRouter.put('/:id', superAdminGuardMiddleware, postValidationMiddleware, inputValidationResultMiddleware, updatePostHandler)

postsRouter.put('/:postId/like-status',
    authMiddleware,
    idValidation({name: 'postId', type: 'param'}),
    enumValidation('likeStatus', LikeStatus),
    inputValidationResultMiddleware,
    changePostLikeStatusHandler,
)

postsRouter.delete('/:id', superAdminGuardMiddleware, deletePostHandler)

// comments
postsRouter.get('/:postId/comments', notNecessaryAuthTokenCheckingMiddleware, idValidation({name:'postId', type:'param'}), commentsQueryMiddleware, inputValidationResultMiddleware, getCommentsHandler)
postsRouter.post('/:postId/comments', authMiddleware, idValidation({name:'postId', type:'param'}), commentValidationMiddleware, inputValidationResultMiddleware, createCommentHandler)

export {postsRouter};