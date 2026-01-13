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
import {injectable} from "inversify";
import {CommentLikeModel, CommentModel} from "../schemes/comment.db.schema";
import {LikeStatus} from "../../../core/enums/like.status.enum";
import {CommentLikeDb} from "../types/comment.like.db";

@injectable()
export class CommentsQueryRepository {


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

    public getAll = async (params: CommentsQueryList, userId: string): Promise<PaginatorOutput<CommentViewModel>> => {
        const {postId, sortBy, sortDirection, pageSize, pageNumber} = params;

        const items = await CommentModel
            .find(this.getListFilter({postId}))
            .sort({[sortBy]: getSortDbDirection(sortDirection)})
            .skip(getSkipDbValue({pageSize, pageNumber}))
            .limit(pageSize)
            .lean()

        const totalCount = await this.getCount({postId})

        const likeRecords = await CommentLikeModel.find({commentId:items.map(comment => String(comment._id))}).lean()

        const mapWithLikes:Record<string, CommentLikeDb[]> = {}

        likeRecords.forEach((likeRecord) => {
            if(!mapWithLikes[likeRecord.commentId]){
                mapWithLikes[likeRecord.commentId] = []
            }
            mapWithLikes[likeRecord.commentId].push(likeRecord)
        })

        const parsedItems = items.map((comment) => {
            let
                likesCount = 0,
                dislikeCount = 0,
                currentUserStatus = LikeStatus.None;
            mapWithLikes[String(comment._id)].forEach((record) => {
                record.status === LikeStatus.Like && (likesCount++);
                record.status === LikeStatus.Dislike && (dislikeCount++);
                record.userId === userId && (currentUserStatus = record.status);
            });


            return CommentsQueryRepository.getViewModel(comment, likesCount, dislikeCount, currentUserStatus)
        });



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
            const likeRecords = await CommentLikeModel.find({commentId: String(entity._id)}).lean();

            let
                likesCount = 0,
                dislikeCount = 0,
                currentUserStatus = LikeStatus.None;

            likeRecords.forEach((record) => {
                record.status === LikeStatus.Like && (likesCount++);
                record.status === LikeStatus.Dislike && (dislikeCount++);
                record.userId === userId && (currentUserStatus = record.status);
            });

            return CommentsQueryRepository.getViewModel(entity, likesCount, dislikeCount, currentUserStatus);
        }
        return null;
    }

    public isPersistInDb = async (id: string): Promise<boolean> => {
        const count = await CommentModel.countDocuments({_id: new ObjectId(id)});
        return count > 0;
    }

}


