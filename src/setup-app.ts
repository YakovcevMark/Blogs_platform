import express, {Express} from "express";
import {HTTP_STATUS_CODES} from "./core/enums/http-status-codes";
import {RoutePaths} from "./models/paths";
import {blogsRouter} from "./models/blogs/routes";
import {postsRouter} from "./models/posts/routes";
import {connectToDatabase, rateLimitsCollection, refreshTokensCollection} from "./db-settings";
import {usersRouter} from "./models/users/routes";
import {authRouter} from "./models/auth/routes";
import {blogsService} from "./models/blogs/application/blogs.service";
import {postsService} from "./models/posts/application/posts.service";
import {commentsService} from "./models/comments/application/comments.service";
import {commentsRouter} from "./models/comments/routes";
import {sessionDevicesService, usersService} from "./core/index";
import cookieParser from "cookie-parser";
import {sessionDevicesRouter} from "./models/session-devices/routes";

export const setupApp = async (app: Express) => {
    app.use(express.json());
    app.use(cookieParser());
    app.set('trust proxy', true);

    await connectToDatabase();

    app.use(RoutePaths.auth, authRouter)
    app.use(RoutePaths.blogs, blogsRouter)
    app.use(RoutePaths.comments, commentsRouter)
    app.use(RoutePaths.posts, postsRouter)
    app.use(RoutePaths.users, usersRouter)
    app.use(RoutePaths.devices, sessionDevicesRouter)



    app.delete("/testing/all-data", (req, res) => {
        postsService.clearDB()
        blogsService.clearDB()
        usersService.clearDB()
        commentsService.clearDB()
        sessionDevicesService.clearDB()
        rateLimitsCollection.deleteMany();
        refreshTokensCollection.deleteMany()
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
    });

    return app;
};