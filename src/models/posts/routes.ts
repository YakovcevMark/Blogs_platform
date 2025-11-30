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
import {idValidation} from "../../core/validation";
import {commentsQueryRepository} from "../comments/repositories/query-repo";
import {commentsQueryMiddleware} from "../comments/middleware/comments.query.middleware";
import {getCommentsHandler} from "../comments/handlers/get";
import {commentValidationMiddleware} from "../comments/validation/comment.dto.validation";
import {createCommentHandler} from "../comments/handlers/post";

const postsRouter = Router()

postsRouter.get('', postsQueryMiddleware, inputValidationResultMiddleware, getPostsHandler)
postsRouter.get('/:id', getPostByIdHandler)
postsRouter.post('', authMiddleware, postValidationMiddleware, blogIdBodyValidation, inputValidationResultMiddleware, createPostHandler)
postsRouter.put('/:id', authMiddleware, postValidationMiddleware, inputValidationResultMiddleware, updatePostHandler)
postsRouter.delete('/:id', authMiddleware, deletePostHandler)

// comments
postsRouter.get('/:postId/comments', idValidation({name:'postId', type:'param'}), commentsQueryMiddleware, inputValidationResultMiddleware, getCommentsHandler)
postsRouter.post('/:postId/comments', authMiddleware, idValidation({name:'postId', type:'param'}), commentValidationMiddleware, inputValidationResultMiddleware, createCommentHandler)

export {postsRouter};