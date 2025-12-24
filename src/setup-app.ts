import express, {Express} from "express";
import {HTTP_STATUS_CODES} from "./core/enums/http-status-codes";
import {RoutePaths} from "./models/paths";
import {blogsRouter} from "./models/blogs/routes";
import {postsRouter} from "./models/posts/routes";
import {
    blogsCollection,
    commentsCollection,
    connectToDatabase,
    postsCollection,
    rateLimitsCollection,
    refreshTokensCollection,
    sessionDevicesCollection,
    usersCollection
} from "./db-settings";
import {usersRouter} from "./models/users/routes";
import {authRouter} from "./models/auth/routes";
import {commentsRouter} from "./models/comments/routes";
import cookieParser from "cookie-parser";
import {sessionDevicesRouter} from "./models/session-devices/routes";

export const setupApp = async (app: Express) => {
    //TODO: сделать глобальную отловку ошибок
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
        postsCollection.deleteMany()
        blogsCollection.deleteMany()
        usersCollection.deleteMany()
        commentsCollection.deleteMany()
        sessionDevicesCollection.deleteMany()
        rateLimitsCollection.deleteMany();
        refreshTokensCollection.deleteMany()
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
    });

    return app;
};