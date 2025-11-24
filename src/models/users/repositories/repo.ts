import {usersCollection} from "../../../db-settings";
import {ObjectId, WithId} from "mongodb";
import {UserDb} from "../types/user.db.model";


class UsersRepository {

    public create = async (entity: UserDb): Promise<WithId<UserDb>> => {
        const result = await usersCollection.insertOne(entity);
        return {...entity, _id: result.insertedId};
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