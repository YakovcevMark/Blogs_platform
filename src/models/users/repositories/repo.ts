import {usersCollection} from "../../../db-settings";
import {ObjectId, WithId} from "mongodb";
import {UserDb} from "../types/user.db.model";
import {UserViewModel} from "../types/user.view.model";
import {getDbFilters} from "../../../core/utils/get-db-filters";


export class UsersRepository {

    public getById = async (id: string): Promise<WithId<UserDb> | null> => {
        return usersCollection.findOne({_id: new ObjectId(id)});
    }

    public getByCode = async (code: string): Promise<WithId<UserDb> | null> => {
        return await usersCollection.findOne({'emailConformation.codes.code': code});
    }

    public getUserByLoginOrEmail = async (loginOrEmail: string): Promise<WithId<UserDb> | null> => {
        return await usersCollection.findOne(getDbFilters<UserViewModel>([
            {fieldName: 'login', queryParam: loginOrEmail},
            {fieldName: 'email', queryParam: loginOrEmail}
        ]));
    }

    public confirmEmail = async (id: string): Promise<boolean> => {

        const response = await usersCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                'emailConformation.codes': [],
                'emailConformation.isConfirmed': true,
            }
        });

        return response.modifiedCount > 0
    }

    public addConformationCode = async (id: string, code: string, expired_in: Date): Promise<boolean> => {

        const response = await usersCollection.updateOne({_id: new ObjectId(id)}, {
            $push: {
                'emailConformation.codes':{
                    code,
                    expired_in
                }
            },
        });

        return response.modifiedCount > 0
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