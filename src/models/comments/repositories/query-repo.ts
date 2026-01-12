import {ObjectId, WithId} from "mongodb";
import {CommentsQueryList} from "../types/comments.query.list";
import {getSortDbDirection} from "../../../core/utils/get-sort-db-direction";
import {getSkipDbValue} from "../../../core/utils/get-skip-db-value";
import {getDbFilters} from "../../../core/utils/get-db-filters";
import {CommentDb} from "../types/comment.db.model";
import {CommentViewModel} from "../types/comment.view.model";
import {getMongoViewModel} from "../../../core/utils/get-view-model";
import {PaginatorOutput} from "../../../core/types/paginator.output";
import {getPagesCount} from "../../../core/utils/get-pages-count";
import {inject, injectable} from "inversify";
import {CommentModel} from "../schemes/comment.db.schema";
import {LikesQueryRepository} from "../../likes/repositories/likes.query.repository";
import {LikeStatus} from "../../likes/enums/like.status.enum";

@injectable()
export class CommentsQueryRepository {
    constructor(@inject(LikesQueryRepository) protected likesQueryRepository: LikesQueryRepository) {
    }

    static getViewModel = (comment: WithId<CommentDb>, likesCount: number, dislikesCount: number, myStatus: LikeStatus): CommentViewModel => {
        const commentDB = getMongoViewModel(comment)
        return {
            id: commentDB.id,
            content: commentDB.content,
            commentatorInfo: commentDB.commentatorInfo,
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount,
                dislikesCount,
                myStatus
            }
        }
    }
    private getListFilter = (params: Pick<CommentsQueryList, 'postId'>) => {
        const {postId} = params;
        return getDbFilters<CommentDb>([
            {fieldName: 'postId', queryParam: postId, isStrictEqual: true},
        ])
    }

    private getLikesData(entity: CommentDb, userId: string) {
        return Promise.all([
            this.likesQueryRepository.getLikesCount(entity.likesIds),
            this.likesQueryRepository.getDislikesCount(entity.likesIds),
            this.likesQueryRepository.getStatusByUserId(entity.likesIds, userId)
        ])
    }

    public getAll = async (params: CommentsQueryList, userId:string): Promise<PaginatorOutput<CommentViewModel>> => {
        const {postId, sortBy, sortDirection, pageSize, pageNumber} = params;

        const items = await CommentModel
            .find(this.getListFilter({postId}))
            .sort({[sortBy]: getSortDbDirection(sortDirection)})
            .skip(getSkipDbValue({pageSize, pageNumber}))
            .limit(pageSize)
            .lean()

        const totalCount = await this.getCount({postId})

        const parsedItems = [];

        for (const item of items) {
            const [likesCount, dislikeCount, currentUserStatus] = await this.getLikesData(item, userId);
            parsedItems.push(CommentsQueryRepository.getViewModel(item, likesCount, dislikeCount, currentUserStatus))
        }


        return {
            pageSize,
            items: parsedItems,
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

    public getById = async (id: string, userId: string): Promise<CommentViewModel | null> => {
        const entity = await CommentModel.findOne({_id: new ObjectId(id)}).lean();

        if (entity) {
            const [likesCount, dislikesCount, currentUserStatus] = await this.getLikesData(entity, userId);
            return CommentsQueryRepository.getViewModel(entity, likesCount, dislikesCount, currentUserStatus);
        }
        return null;
    }

    public isPersistInDb = async (id: string): Promise<boolean> => {
        const count = await CommentModel.countDocuments({_id: new ObjectId(id)});
        return count > 0;
    }

}


