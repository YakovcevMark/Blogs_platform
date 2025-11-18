import express, {Express} from "express";
import {HTTP_STATUS_CODES} from "./core/enums/http-status-codes";
import {blogsRepository} from "./models/blogs/repositories/db-repository";
import {postsRepository} from "./models/posts/repositories/db-repository";
import {RoutePaths} from "./models/paths";
import {blogsRouter} from "./models/blogs/routes";
import {postsRouter} from "./models/posts/routes";
import {connectToDatabase} from "./db-settings";

export const setupApp = async (app: Express) => {
    app.use(express.json());

    await connectToDatabase();

    app.use(RoutePaths.blogs, blogsRouter)
    app.use(RoutePaths.posts, postsRouter)



    app.delete("/testing/all-data", (req, res) => {
        postsRepository.clearDB()
        blogsRepository.clearDB()
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
    });

    return app;
};