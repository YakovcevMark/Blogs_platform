import dotenv from 'dotenv';
import {MongoClient} from "mongodb";
import {BlogViewModel} from "./models/blogs/types/blog.view.model";
import {PostViewModel} from "./models/posts/types/post.view.model";
import {UserDb} from "./models/users/types/user.db.model";

dotenv.config();

const mongo_url = process.env.MONGO_URL || 'mongodb://localhost:27017'
const db_name = process.env.DB_NAME || 'dev'
const client = new MongoClient(mongo_url);
const db = client.db(db_name);

export const blogsCollection = db.collection<BlogViewModel>("blogs");
export const postsCollection = db.collection<PostViewModel>("posts");
export const usersCollection = db.collection<UserDb>("users");

export async function connectToDatabase() {
    try {
        await client.connect();
        await client.db(db_name).command({ ping: 1 });
        console.log(`Successfully connected to database: ${mongo_url}`);
        console.log(`Data base name: ${db_name}`);
    } catch (error) {
        await client.close();
        throw new Error(`Can't connected to db with url:${mongo_url}`);
    }
}