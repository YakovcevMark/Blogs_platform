import {UserViewModel} from "../types/user.view.model";
import {usersCollection} from "../../../db-settings";
import {ObjectId, WithId} from "mongodb";
import {UsersQueryList} from "../types/users.query.list";
import {getSortDbDirection} from "../../../core/utils/get-sort-db-direction";
import {getSkipDbValue} from "../../../core/utils/get-skip-db-value";
import {getDbFilters} from "../../../core/utils/get-db-filters";
import {UserDb} from "../types/user.db.model";
import {getMongoViewModel} from "../../../core/utils/get-view-model";
import {RequestEntityId} from "../../../core/types";


export class UsersQueryRepository {

    private getListFilter = (params: Pick<UsersQueryList, 'searchLoginTerm' | 'searchEmailTerm'> & {
        isStrictEqual?: boolean
    }) => {
        const {searchLoginTerm, searchEmailTerm, isStrictEqual} = params;
        return getDbFilters<UserViewModel>([
            {fieldName: 'login', queryParam: searchLoginTerm, isStrictEqual},
            {fieldName: 'email', queryParam: searchEmailTerm, isStrictEqual}
        ])
    }

    public getAll = async (params: UsersQueryList): Promise<WithId<UserDb>[]> => {
        const {searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageSize, pageNumber} = params;

        return await usersCollection
            .find(this.getListFilter({searchLoginTerm, searchEmailTerm, isStrictEqual: false}))
            .sort(sortBy, getSortDbDirection(sortDirection))
            .skip(getSkipDbValue({pageSize, pageNumber}))
            .limit(pageSize)
            .toArray()
    }

    public getById = async (params: RequestEntityId): Promise<UserViewModel | null> => {
        const {id} = params;
        const entity = await usersCollection.findOne({_id: new ObjectId(id)});
        if (entity) {
            return UsersQueryRepository.getViewModel(entity)
        }
        return null;

    }

    public getCount = async (params: Partial<Pick<UsersQueryList, 'searchLoginTerm' | 'searchEmailTerm'>> & {
        isValidation?: boolean
    }): Promise<number> => {
        const {searchLoginTerm, searchEmailTerm} = params;
        return await usersCollection.countDocuments(this.getListFilter({
            searchLoginTerm,
            searchEmailTerm,
        }));
    }

    public isPersistInDb = async (id: string): Promise<boolean> => {
        const count = await usersCollection.countDocuments({_id: new ObjectId(id)});
        return count > 0;
    }

    public getUserByLoginOrEmail = async (loginOrEmail: string): Promise<WithId<UserDb> | null> => {
        return await usersCollection.findOne(this.getListFilter({
            searchLoginTerm: loginOrEmail,
            searchEmailTerm: loginOrEmail,
            isStrictEqual: true
        }));
    }

    public clearDB = async () => {
        await usersCollection.deleteMany()
    }

    static getViewModel = (user: WithId<UserDb>): UserViewModel => {
        const userDB = getMongoViewModel(user)
        return {
            id: userDB.id,
            email: userDB.email,
            login: userDB.login,
            createdAt: userDB.createdAt,
        }
    }
}


const usersQueryRepository = new UsersQueryRepository();

export {
    usersQueryRepository,
};