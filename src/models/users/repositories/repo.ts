import {ObjectId, WithId} from "mongodb";
import {UserDb} from "../types/user.db.model";
import {UserViewModel} from "../types/user.view.model";
import {getDbFilters} from "../../../core/utils/get-db-filters";
import {injectable} from "inversify";
import {UserModel} from "../schemas/user.db.schema";

@injectable()
export class UsersRepository {

    public getById = async (id: string): Promise<WithId<UserDb> | null> => {
        return UserModel.findOne({_id: new ObjectId(id)}).lean();
    }

    public getByCode = async (code: string): Promise<WithId<UserDb> | null> => {
        return UserModel.findOne({'emailConformation.codes.code': code}).lean();
    }

    // public getByRefreshToken = async (refreshToken: string): Promise<WithId<UserDb> | null> => {
    //     return await usersCollection.findOne({'refreshTokens': refreshToken});
    // }

    public getUserByLoginOrEmail = async (loginOrEmail: string): Promise<WithId<UserDb> | null> => {
        return UserModel.findOne(getDbFilters<UserViewModel>([
            {fieldName: 'login', queryParam: loginOrEmail, isStrictEqual: true},
            {fieldName: 'email', queryParam: loginOrEmail, isStrictEqual: true}
        ])).lean();
    }

    public isUserWithEmailExist = async (email: string): Promise<boolean> => {
        const count = await UserModel.countDocuments(getDbFilters<UserViewModel>([
            {fieldName: 'email', queryParam: email, isStrictEqual: true}
        ]));
        return count > 0;
    }

    public isUserWithLoginExist = async (login: string): Promise<boolean> => {
        const count = await UserModel.countDocuments(getDbFilters<UserViewModel>([
            {fieldName: 'login', queryParam: login, isStrictEqual: true},
        ]));
        return count > 0;
    }

    public confirmEmail = async (id: string): Promise<boolean> => {

        const response = await UserModel.updateOne({_id: new ObjectId(id)}, {
            $set: {
                'emailConformation.codes': [],
                'emailConformation.isConfirmed': true,
            }
        });

        return response.modifiedCount > 0
    }

    public addConformationCode = async (id: string, code: string, expired_in: Date): Promise<boolean> => {

        const response = await UserModel.updateOne({_id: new ObjectId(id)}, {
            $push: {
                'emailConformation.codes': {
                    code,
                    expired_in
                }
            },
        });

        return response.modifiedCount > 0
    }

    async updateByEmail(email: string, dto: Partial<UserDb>): Promise<boolean> {
        const response = await UserModel.updateOne({email}, {
            $set: dto
        });
        return response.modifiedCount > 0
    }

    public create = async (dto: UserDb): Promise<string> => {
        const entity = new UserModel(dto);
        await entity.save();
        return entity.id
    }

    public remove = async (id: string): Promise<boolean> => {
        const response = await UserModel.deleteOne({_id: new ObjectId(id)});
        return response.deletedCount > 0
    }

}

