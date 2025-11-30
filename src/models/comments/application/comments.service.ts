import {CommentViewModel} from "../types/comment.view.model";
import {PaginatorOutput} from "../../../core/types/paginator.output";
import {CommentsQueryList} from "../types/comments.query.list";
import {getPagesCount} from "../../../core/utils/get-pages-count";
import {commentsRepository} from "../repositories/repo";
import {CommentsQueryRepository, commentsQueryRepository} from "../repositories/query-repo";
import {CommentDb} from "../types/comment.db.model";
import {CommentInputModel} from "../types/comment.input.model";
import {UserViewModel} from "../../users/types/user.view.model";
import {RequestEntityId} from "../../../core/types";

class CommentsService {



    public getAll = async (params: CommentsQueryList): Promise<PaginatorOutput<CommentViewModel>> => {
        const {postId, pageSize, pageNumber} = params;
        const items = await commentsQueryRepository.getAll(params)
        const totalCount = await commentsQueryRepository.getCount({postId});

        return {
            pageSize,
            items: items,
            page: pageNumber,
            pagesCount: getPagesCount({pageSize, totalCount}),
            totalCount
        }

    }

    public create = async (params: {
        user: UserViewModel,
        body: CommentInputModel,
        postId: string
    }): Promise<CommentViewModel> => {

        const {postId, user, body} = params;

        const entity: CommentDb = {
            createdAt: new Date().toISOString(),
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login
            },
            content: body.content,
            postId
        }

        const resp = await commentsRepository.create(entity);

        return CommentsQueryRepository.getViewModel(resp);
    }

    public update = async (params: RequestEntityId & {
        body: CommentInputModel,
    }): Promise<boolean> => {
        return await commentsRepository.update(params)
    }

    public remove = async (id: string): Promise<boolean> => {
        return await commentsRepository.remove(id);
    }

    public clearDB = async () => {
        return await commentsRepository.clearDB();
    }

}

const commentsService = new CommentsService();

export {
    commentsService
}