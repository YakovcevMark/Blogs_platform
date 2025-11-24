import {UserViewModel} from "../types/user.view.model";
import {usersCollection} from "../../../db-settings";
import {ObjectId, WithId} from "mongodb";
import {UsersQueryList} from "../types/users.query.list";
import {getSortDbDirection} from "../../../core/utils/get-sort-db-direction";
import {getSkipDbValue} from "../../../core/utils/get-skip-db-value";
import {getDbFilters} from "../../../core/utils/get-db-filters";
import {UserDb} from "../types/user.db.model";


class UsersQueryRepository {

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
        return await usersCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]});
    }

    public clearDB = async () => {
        await usersCollection.deleteMany()
    }

}


const usersQueryRepository = new UsersQueryRepository();

export {
    usersQueryRepository,
};