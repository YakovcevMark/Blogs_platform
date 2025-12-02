import {usersCollection} from "../../../db-settings";
import {ObjectId} from "mongodb";
import {UserDb} from "../types/user.db.model";


class UsersRepository {

    public getById = async (id: string): Promise<UserDb | null> => {
        return usersCollection.findOne({_id: new ObjectId(id)});
    }

    public create = async (entity: UserDb): Promise<string> => {
        const result = await usersCollection.insertOne(entity);
        return String(result.insertedId);
    }

    public remove = async (id: string): Promise<boolean> => {
        const response = await usersCollection.deleteOne({_id: new ObjectId(id)});
        return response.deletedCount > 0
    }

    public clearDB = async () => {
        await usersCollection.deleteMany()
    }

}


const usersRepository = new UsersRepository();

export {
    usersRepository,
};