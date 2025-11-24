import express, {Express} from "express";
import {HTTP_STATUS_CODES} from "./core/enums/http-status-codes";
import {RoutePaths} from "./models/paths";
import {blogsRouter} from "./models/blogs/routes";
import {postsRouter} from "./models/posts/routes";
import {connectToDatabase} from "./db-settings";
import {usersRouter} from "./models/users/routes";
import {authRouter} from "./models/auth/routes";
import {usersService} from "./models/users/application/users.service";
import {blogsService} from "./models/blogs/application/blogs.service";
import {postsService} from "./models/posts/application/posts.service";

export const setupApp = async (app: Express) => {
    app.use(express.json());

    await connectToDatabase();

    app.use(RoutePaths.blogs, blogsRouter)
    app.use(RoutePaths.posts, postsRouter)
    app.use(RoutePaths.users, usersRouter)
    app.use(RoutePaths.auth, authRouter)



    app.delete("/testing/all-data", (req, res) => {
        postsService.clearDB()
        blogsService.clearDB()
        usersService.clearDB()
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
    });

    return app;
};