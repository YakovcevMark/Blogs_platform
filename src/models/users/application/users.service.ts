import {UserViewModel} from "../types/user.view.model";
import {PaginatorOutput} from "../../../core/types/paginator.output";
import {UsersQueryList} from "../types/users.query.list";
import {getPagesCount} from "../../../core/utils/get-pages-count";
import {usersRepository} from "../repositories/repo";
import {UsersQueryRepository, usersQueryRepository} from "../repositories/query-repo";
import {UserDb} from "../types/user.db.model";
import {UserInputModel} from "../types/user.input.model";
import {compare, hash} from 'bcrypt'
import {LoginInputModel} from "../../auth/types/login,input.model";

class UsersService {

    private genHashedPassword = async (password: string): Promise<string> => {
        return await hash(password, 10);
    }

    public getAll = async (params: UsersQueryList): Promise<PaginatorOutput<UserViewModel>> => {
        const {searchEmailTerm, searchLoginTerm, pageSize, pageNumber} = params;
        const items = await usersQueryRepository.getAll(params)
        const totalCount = await usersQueryRepository.getCount({searchEmailTerm, searchLoginTerm});

        return {
            pageSize,
            items: items.map(UsersQueryRepository.getViewModel),
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

        return UsersQueryRepository.getViewModel(resp);
    }

    public checkCredentials = async (body: LoginInputModel): Promise<UserViewModel | null> => {
        const user = await usersQueryRepository.getUserByLoginOrEmail(body.loginOrEmail)

        if (!user) {
            return null;
        }

        const isPasswordCorrect = await compare(body.password, user.password);

        if (!isPasswordCorrect) {
            return null;
        }

        return UsersQueryRepository.getViewModel(user);
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