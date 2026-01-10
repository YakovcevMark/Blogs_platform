import {ObjectId, WithId} from "mongodb";
import {CommentsQueryList} from "../types/comments.query.list";
import {getSortDbDirection} from "../../../core/utils/get-sort-db-direction";
import {getSkipDbValue} from "../../../core/utils/get-skip-db-value";
import {getDbFilters} from "../../../core/utils/get-db-filters";
import {CommentDb} from "../types/comment.db.model";
import {RequestEntityId} from "../../../core/types";
import {CommentViewModel} from "../types/comment.view.model";
import {getMongoViewModel} from "../../../core/utils/get-view-model";
import {PaginatorOutput} from "../../../core/types/paginator.output";
import {getPagesCount} from "../../../core/utils/get-pages-count";
import {injectable} from "inversify";
import {CommentModel} from "../schemes/comment.db.schema";

@injectable()
export class CommentsQueryRepository {
    static getViewModel = (comment: WithId<CommentDb>): CommentViewModel => {
        const commentDB = getMongoViewModel(comment)
        return {
            id: commentDB.id,
            content: commentDB.content,
            commentatorInfo: commentDB.commentatorInfo,
            createdAt: comment.createdAt
        }
    }
    private getListFilter = (params: Pick<CommentsQueryList, 'postId'>) => {
        const {postId} = params;
        return getDbFilters<CommentDb>([
            {fieldName: 'postId', queryParam: postId, isStrictEqual: true},
        ])
    }

    public getAll = async (params: CommentsQueryList): Promise<PaginatorOutput<CommentViewModel>> => {
        const {postId, sortBy, sortDirection, pageSize, pageNumber} = params;

        const items = await CommentModel
            .find(this.getListFilter({postId}))
            .sort({ [sortBy]: getSortDbDirection(sortDirection) })
            .skip(getSkipDbValue({pageSize, pageNumber}))
            .limit(pageSize)
            .lean()
        const totalCount = await this.getCount({postId})

        return {
            pageSize,
            items: items.map(CommentsQueryRepository.getViewModel),
            page: pageNumber,
            pagesCount: getPagesCount({pageSize, totalCount}),
            totalCount
        }
    }

    public getCount = async (params: Partial<Pick<CommentsQueryList, 'postId'>>): Promise<number> => {
        const {postId} = params;
        return CommentModel.countDocuments(this.getListFilter({
            postId,
        }));
    }

    public getById = async (params: RequestEntityId): Promise<CommentViewModel | null> => {
        const {id} = params;
        const entity = await CommentModel.findOne({_id: new ObjectId(id)}).lean();
        if (entity) {
            return CommentsQueryRepository.getViewModel(entity);
        }
        return null;
    }

    public isPersistInDb = async (id: string): Promise<boolean> => {
        const count = await CommentModel.countDocuments({_id: new ObjectId(id)});
        return count > 0;
    }

}


