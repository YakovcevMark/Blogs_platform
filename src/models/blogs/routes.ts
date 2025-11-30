import {Router} from "express";
import {getBlogsHandler} from "./handlers/get";
import {getBlogByIdHandler} from "./handlers/get-by-id";
import {createBlogHandler} from "./handlers/post";
import {updateBlogHandler} from "./handlers/put";
import {deleteBlogHandler} from "./handlers/delete";
import {blogValidationMiddleware} from "./validation/blog.dto.validation";
import {inputValidationResultMiddleware} from "../../middleware/input-validation-result-middleware";
import {authMiddleware} from "../../middleware/auth-middleware";
import {blogsQueryMiddleware} from "./middleware/blogs.query.middleware";
import {RoutePaths} from "../paths";
import {postsQueryMiddleware} from "../posts/middleware/posts.query.middleware";
import {blogIdParamValidation} from "./middleware/blogIdParamValidation";
import {getPostsByBlogIdHandler} from "./handlers/get-posts-by-blog-id-handler";
import {postValidationMiddleware} from "../posts/validation/post.dto.validation";
import {createPostByBlogIdHandler} from "./handlers/create.post.by.blog.id";

const blogsRouter = Router()

blogsRouter.get('', blogsQueryMiddleware, inputValidationResultMiddleware, getBlogsHandler)

blogsRouter.get('/:id', getBlogByIdHandler)

blogsRouter.post('',
    authMiddleware,
    blogValidationMiddleware,
    inputValidationResultMiddleware,
    createBlogHandler
)

blogsRouter.put('/:id',
    authMiddleware,
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
    authMiddleware,
    blogIdParamValidation,
    postValidationMiddleware,
    inputValidationResultMiddleware,
    createPostByBlogIdHandler,
)

blogsRouter.delete('/:id', authMiddleware, deleteBlogHandler)

export {blogsRouter};