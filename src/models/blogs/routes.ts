import {Router} from "express";
import {getBlogsHandler} from "./handlers/get";
import {getBlogByIdHandler} from "./handlers/get-by-id";
import {createBlogHandler} from "./handlers/post";
import {updateBlogHandler} from "./handlers/put";
import {deleteBlogHandler} from "./handlers/delete";
import {blogValidationMiddleware} from "./validation/blog.dto.validation";
import {inputValidationResultMiddleware} from "../../middleware/input-validation-result-middleware";
import {blogsQueryMiddleware} from "./middleware/blogs.query.middleware";
import {RoutePaths} from "../paths";
import {postsQueryMiddleware} from "../posts/middleware/posts.query.middleware";
import {blogIdParamValidation} from "./middleware/blogIdParamValidation";
import {getPostsByBlogIdHandler} from "./handlers/get-posts-by-blog-id-handler";
import {postValidationMiddleware} from "../posts/validation/post.dto.validation";
import {createPostByBlogIdHandler} from "./handlers/create.post.by.blog.id";
import {superAdminGuardMiddleware} from "../../middleware/super-admin-guard-middleware";

const blogsRouter = Router()

blogsRouter.get('', blogsQueryMiddleware, inputValidationResultMiddleware, getBlogsHandler)

blogsRouter.get('/:id', getBlogByIdHandler)

blogsRouter.post('',
    superAdminGuardMiddleware,
    blogValidationMiddleware,
    inputValidationResultMiddleware,
    createBlogHandler
)

blogsRouter.put('/:id',
    superAdminGuardMiddleware,
    blogValidationMiddleware,
    inputValidationResultMiddleware,
    updateBlogHandler
)

blogsRouter.get(`/:blogId${RoutePaths.posts}`,
    postsQueryMiddleware,
    blogIdParamValidation,
    getPostsByBlogIdHandler
)

blogsRouter.post(`/:blogId${RoutePaths.posts}`,
    superAdminGuardMiddleware,
    blogIdParamValidation,
    postValidationMiddleware,
    inputValidationResultMiddleware,
    createPostByBlogIdHandler,
)

blogsRouter.delete('/:id', superAdminGuardMiddleware, deleteBlogHandler)

export {blogsRouter};