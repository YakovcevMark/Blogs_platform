import express, {Express} from "express";
import {HTTP_STATUS_CODES} from "./core/enums/http-status-codes";
import {RoutePaths} from "./models/paths";
import {blogsRouter} from "./models/blogs/routes";
import {postsRouter} from "./models/posts/routes";
import {connectToDatabase,} from "./db-settings";
import {usersRouter} from "./models/users/routes";
import {authRouter} from "./models/auth/routes";
import {commentsRouter} from "./models/comments/routes";
import cookieParser from "cookie-parser";
import {sessionDevicesRouter} from "./models/session-devices/routes";
import {SessionDeviceModel} from "./models/session-devices/schemas/session-schema";
import {PasswordRecoveryCodeModel} from "./core/schemas/password-recovery-code-db-schema";
import {RateLimitRecordModel} from "./core/schemas/rate-limit-record-schema";
import {CommentModel} from "./models/comments/schemes/comment.db.schema";
import {UserModel} from "./models/users/schemas/user.db.schema";
import {PostModel} from "./models/posts/schemas/post.db.schema";
import {BlogModel} from "./models/blogs/schemas/blog.schema";
import {LikeModel} from "./models/likes/schemas/like.schema";

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


    app.delete("/testing/all-data", async (req, res) => {
        await Promise.all([
            PostModel.deleteMany(),
            BlogModel.deleteMany(),
            UserModel.deleteMany(),
            CommentModel.deleteMany(),
            SessionDeviceModel.deleteMany(),
            RateLimitRecordModel.deleteMany(),
            PasswordRecoveryCodeModel.deleteMany(),
            LikeModel.deleteMany(),
        ])
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
    });

    return app;
};