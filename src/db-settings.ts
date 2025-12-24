import dotenv from 'dotenv';
import {MongoClient} from "mongodb";
import {BlogViewModel} from "./models/blogs/types/blog.view.model";
import {PostViewModel} from "./models/posts/types/post.view.model";
import {UserDb} from "./models/users/types/user.db.model";
import {CommentDb} from "./models/comments/types/comment.db.model";
import {RefreshTokenDB} from "./core/types/refresh.token.model";
import {SessionDeviceDB} from "./models/session-devices/types/session-devices-db.model";
import {RateLimitRecordDB} from "./core/types/rate-limit-record";

dotenv.config();

const mongo_url = process.env.MONGO_URL || 'mongodb://localhost:27017'
const db_name = process.env.DB_NAME || 'dev'
export const client = new MongoClient(mongo_url);
const db = client.db(db_name);

export const blogsCollection = db.collection<BlogViewModel>("blogs");
export const postsCollection = db.collection<PostViewModel>("posts");
export const usersCollection = db.collection<UserDb>("users");
export const commentsCollection = db.collection<CommentDb>("comments");
export const refreshTokensCollection = db.collection<RefreshTokenDB>("refreshTokens");
export const sessionDevicesCollection = db.collection<SessionDeviceDB>("sessionDevices");
export const rateLimitsCollection = db.collection<RateLimitRecordDB>("rateLimitRecords");

export async function connectToDatabase() {
    try {
        await client.connect();
        await client.db(db_name).command({ ping: 1 });
        console.log(`Successfully connected to database: ${mongo_url}`);
        console.log(`Data base name: ${db_name}`);

        // удаляем токены в дб
        await refreshTokensCollection.createIndex(
            { expireAt: 1 },
            { expireAfterSeconds: 0 }
        );
        // удаляем сессию в дб
        await sessionDevicesCollection.createIndex(
            { expireAt: 1 },
            { expireAfterSeconds: 0 }
        );
        await rateLimitsCollection.createIndex(
            { date: 1 },
            { expireAfterSeconds: 10 }
        );


    } catch (error) {
        await client.close();
        console.log(`Can't connected to db with url:${mongo_url}`);

    }
}
