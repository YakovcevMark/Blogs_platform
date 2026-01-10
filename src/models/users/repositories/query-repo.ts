import {UserViewModel} from "../types/user.view.model";
import {ObjectId, WithId} from "mongodb";
import {UsersQueryList} from "../types/users.query.list";
import {getSortDbDirection} from "../../../core/utils/get-sort-db-direction";
import {getSkipDbValue} from "../../../core/utils/get-skip-db-value";
import {getDbFilters} from "../../../core/utils/get-db-filters";
import {UserDb} from "../types/user.db.model";
import {getMongoViewModel} from "../../../core/utils/get-view-model";
import {RequestEntityId} from "../../../core/types";
import {getPagesCount} from "../../../core/utils/get-pages-count";
import {PaginatorOutput} from "../../../core/types/paginator.output";
import {injectable} from "inversify";
import {UserModel} from "../schemas/user.db.schema";

@injectable()
export class UsersQueryRepository {

    static getViewModel = (user: WithId<UserDb>): UserViewModel => {
        const userDB = getMongoViewModel(user)
        return {
            id: userDB.id,
            email: userDB.email,
            login: userDB.login,
            createdAt: userDB.createdAt,
        }
    }

    private getListFilter = (params: Pick<UsersQueryList, 'searchLoginTerm' | 'searchEmailTerm'> & {
        isStrictEqual?: boolean
    }) => {
        const {searchLoginTerm, searchEmailTerm, isStrictEqual} = params;
        return getDbFilters<UserViewModel>([
            {fieldName: 'login', queryParam: searchLoginTerm, isStrictEqual},
            {fieldName: 'email', queryParam: searchEmailTerm, isStrictEqual}
        ])
    }

    public getAll = async (params: UsersQueryList): Promise<PaginatorOutput<UserViewModel>> => {
        const {searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageSize, pageNumber} = params;

        const items = await UserModel
            .find(this.getListFilter({searchLoginTerm, searchEmailTerm, isStrictEqual: false}))
            .sort({ [sortBy]: getSortDbDirection(sortDirection) })
            .skip(getSkipDbValue({pageSize, pageNumber}))
            .limit(pageSize)
            .lean()

        const totalCount = await this.getCount({searchEmailTerm, searchLoginTerm})

        return {
            pageSize,
            items: items.map(UsersQueryRepository.getViewModel),
            page: pageNumber,
            pagesCount: getPagesCount({pageSize, totalCount}),
            totalCount
        }
    }

    public getById = async (params: RequestEntityId): Promise<UserViewModel | null> => {
        const {id} = params;
        const entity = await UserModel.findOne({_id: new ObjectId(id)}).lean();
        if (entity) {
            return UsersQueryRepository.getViewModel(entity)
        }
        return null;

    }

    public isUserWithEmailExist = async (email: string): Promise<boolean> => {
        const count = await UserModel.countDocuments(getDbFilters<UserViewModel>([
            {fieldName: 'email', queryParam: email, isStrictEqual:true}
        ]));
        return count > 0;
    }

    public isUserWithLoginExist = async (login:string): Promise<boolean> => {
        const count = await UserModel.countDocuments(getDbFilters<UserViewModel>([
            {fieldName: 'login', queryParam: login, isStrictEqual:true},
        ]));
        return count > 0;
    }

    public getCount = async (params: Partial<Pick<UsersQueryList, 'searchLoginTerm' | 'searchEmailTerm'>> & {
        isValidation?: boolean
    }): Promise<number> => {
        const {searchLoginTerm, searchEmailTerm} = params;
        return  UserModel.countDocuments(this.getListFilter({
            searchLoginTerm,
            searchEmailTerm,
        }));
    }

    public isPersistInDb = async (id: string): Promise<boolean> => {
        const count = await UserModel.countDocuments({_id: new ObjectId(id)});
        return count > 0;
    }

    public getUserByLoginOrEmail = async (loginOrEmail: string): Promise<UserViewModel | null> => {
        const user = await UserModel.findOne(this.getListFilter({
            searchLoginTerm: loginOrEmail,
            searchEmailTerm: loginOrEmail,
            isStrictEqual: true
        })).lean();
        if (!user) return null
        return UsersQueryRepository.getViewModel(user);
    }

    public getByRefreshToken = async (refreshToken: string): Promise<UserViewModel | null> => {
        const user =  await UserModel.findOne({'refreshTokens': refreshToken}).lean();
        if (!user) return null
        return UsersQueryRepository.getViewModel(user);
    }

}


