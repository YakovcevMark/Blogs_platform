import {UserViewModel} from "../types/user.view.model";
import {PaginatorOutput} from "../../../core/types/paginator.output";
import {UsersQueryList} from "../types/users.query.list";
import {getMongoViewModel} from "../../../core/utils/get-view-model";
import {getPagesCount} from "../../../core/utils/get-pages-count";
import {usersRepository} from "../repositories/repo";
import {usersQueryRepository} from "../repositories/query-repo";
import {UserDb} from "../types/user.db.model";
import {WithId} from "mongodb";
import {UserInputModel} from "../types/user.input.model";
import {compare, hash} from 'bcrypt'
import {LoginInputModel} from "../../auth/types/login,input.model";

class UsersService {

    private genHashedPassword = async (password: string): Promise<string> => {
        return await hash(password, 10);
    }


    private getUserViewModel = (user: WithId<UserDb>): UserViewModel => {
        const userDB = getMongoViewModel(user)
        return {
            id: userDB.id,
            email: userDB.email,
            login: userDB.login,
            createdAt: userDB.createdAt,
        }
    }

    public getAll = async (params: UsersQueryList): Promise<PaginatorOutput<UserViewModel>> => {
        const {searchEmailTerm, searchLoginTerm, pageSize, pageNumber} = params;
        const items = await usersQueryRepository.getAll(params)
        const totalCount = await usersQueryRepository.getCount({searchEmailTerm, searchLoginTerm});

        return {
            pageSize,
            items: items.map(this.getUserViewModel),
            page: pageNumber,
            pagesCount: getPagesCount({pageSize, totalCount}),
            totalCount
        }

    }

    public create = async (body: UserInputModel): Promise<UserViewModel> => {
        const hashedPassword = await this.genHashedPassword(body.password);

        const entity: UserDb = {
            createdAt: new Date().toISOString(),
            password: hashedPassword,
            email: body.email,
            login: body.login,
        }

        const resp = await usersRepository.create(entity);

        return this.getUserViewModel(resp);
    }

    public checkCredentials = async (body: LoginInputModel): Promise<boolean> => {
        const user = await usersQueryRepository.getUserByLoginOrEmail(body.loginOrEmail)
        if (!user) {
            return false;
        }
        return await compare(body.password, user.password)
    }

    public remove = async (id: string): Promise<boolean> => {
        return await usersRepository.remove(id);
    }

    public clearDB = async () => {
        return await usersRepository.clearDB();
    }

}

const usersService = new UsersService();

export {
    usersService
}