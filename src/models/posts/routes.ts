import {Router} from "express";
import {getPostsHandler} from "./handlers/get";
import {getPostByIdHandler} from "./handlers/get-by-id";
import {createPostHandler} from "./handlers/post";
import {updatePostHandler} from "./handlers/put";
import {deletePostHandler} from "./handlers/delete";
import {postValidationMiddleware} from "./validation/post.dto.validation";
import {inputValidationResultMiddleware} from "../../middleware/input-validation-result-middleware";
import {superAdminGuardMiddleware} from "../../middleware/super-admin-guard-middleware";
import {postsQueryMiddleware} from "./middleware/posts.query.middleware";
import {blogIdBodyValidation} from "./middleware/blogId.body.validation.middleware";

const postsRouter = Router()

postsRouter.get('', postsQueryMiddleware, getPostsHandler)
postsRouter.get('/:id', getPostByIdHandler)
postsRouter.post('', superAdminGuardMiddleware, postValidationMiddleware, blogIdBodyValidation, inputValidationResultMiddleware, createPostHandler)
postsRouter.put('/:id', superAdminGuardMiddleware, postValidationMiddleware, inputValidationResultMiddleware, updatePostHandler)
postsRouter.delete('/:id', superAdminGuardMiddleware, deletePostHandler)

export {postsRouter};