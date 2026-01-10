import dotenv from 'dotenv';
import {MongoClient} from "mongodb";
import mongoose from 'mongoose';

dotenv.config();

const mongo_url = process.env.MONGO_URL || 'mongodb://localhost:27017'
const db_name = process.env.DB_NAME || 'dev'
export const client = new MongoClient(mongo_url);


export async function connectToDatabase() {
    try {
        await mongoose.connect(mongo_url + '/' + db_name);
        console.log(`Successfully connected to database: ${mongo_url}`);
        console.log(`Data base name: ${db_name}`);
        console.log('Mongoose connected:', mongoose.connection.readyState); // 1 = connected
    } catch (error) {
        await mongoose.disconnect();
        console.log(`Can't connected to db with url:${mongo_url}`);
    }
}
