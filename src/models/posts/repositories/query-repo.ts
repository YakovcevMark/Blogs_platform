import {ObjectId, WithId} from "mongodb";
import {getMongoViewModel} from "../../../core/utils/get-view-model";
import {PostViewModel} from "../types/post.view.model";
import {PostsQueryList} from "../types/posts.query.list";
import {getDbFilters} from "../../../core/utils/get-db-filters";
import {getSortDbDirection} from "../../../core/utils/get-sort-db-direction";
import {getSkipDbValue} from "../../../core/utils/get-skip-db-value";
import {PaginatorOutput} from "../../../core/types/paginator.output";
import {getPagesCount} from "../../../core/utils/get-pages-count";
import {injectable} from "inversify";
import {PostLikeModel, PostModel} from "../schemas/post.db.schema";
import {Nullable, RequestEntityId} from "../../../core/types";
import {LikeStatus} from "../../../core/enums/like.status.enum";
import {PostDbModel} from "../types/post.db.model";
import {PostLikeDb} from "../types/post.like.db";

@injectable()
export class PostsQueryRepository {

    static getViewModel = (post: WithId<PostViewModel>): PostViewModel & RequestEntityId => {
        const postDB = getMongoViewModel(post)
        return {
            id: postDB.id,
            title: postDB.title,
            blogId: postDB.blogId,
            shortDescription: postDB.shortDescription,
            content: postDB.content,
            createdAt: postDB.createdAt,
            blogName: postDB.blogName,
            extendedLikesInfo: {
                likesCount: postDB.extendedLikesInfo.likesCount,
                dislikesCount: postDB.extendedLikesInfo.dislikesCount,
                myStatus: postDB.extendedLikesInfo.myStatus,
                newestLikes: postDB.extendedLikesInfo.newestLikes,
            }
        }
    }

    private constructPostModelDependsOfCurrentSessionUserLikeRecord(post: WithId<PostDbModel>, currentSessionUserRecord?: Nullable<PostLikeDb>) {
        return {
            ...post,
            extendedLikesInfo: {
                ...post.extendedLikesInfo,
                myStatus: currentSessionUserRecord?.status ?? LikeStatus.None,
                newestLikes: post.extendedLikesInfo.newestLikes.map((newestLikeRecord) => ({
                    ...newestLikeRecord,
                    addedAt: newestLikeRecord.addedAt.toISOString(),
                })),
            }
        }
    }

    public getAll = async (params: PostsQueryList & { userId: string }): Promise<PaginatorOutput<PostViewModel>> => {
        const {sortBy, sortDirection, pageSize, pageNumber, blogId, userId} = params;

        const items = await PostModel
            .find(getDbFilters<PostViewModel>([{fieldName: 'blogId', queryParam: blogId}]))
            .sort({[sortBy]: getSortDbDirection(sortDirection)})
            .skip(getSkipDbValue({pageSize, pageNumber}))
            .limit(pageSize)
            .lean()

        const totalCount = await this.getCount({blogId})

        const likeRecords = await PostLikeModel.find({postId: items.map(post => String(post._id)), userId}).lean()

        const parsedItems = items.map((post) => {
            const currentSessionUserRecord = likeRecords.find((record) => record.userId === userId && record.postId === String(post._id))
            return PostsQueryRepository.getViewModel(this.constructPostModelDependsOfCurrentSessionUserLikeRecord(post, currentSessionUserRecord))
        });

        return {
            pageSize,
            items: parsedItems,
            page: pageNumber,
            pagesCount: getPagesCount({pageSize, totalCount}),
            totalCount
        }
    }

    public getCount = async (params: Pick<PostsQueryList, 'blogId'>): Promise<number> => {
        const {blogId} = params
        return PostModel.countDocuments(
            getDbFilters<PostViewModel>([{
                fieldName: 'blogId',
                queryParam: blogId
            }])
        );
    }

    public getById = async (id: string, userId: string): Promise<PostViewModel | null> => {
        const entity = await PostModel.findOne({_id: new ObjectId(id)}).lean()
        if (!entity) return null;
        const currentSessionUserRecord = await PostLikeModel.findOne({postId: id, userId}).lean()
        return PostsQueryRepository.getViewModel(this.constructPostModelDependsOfCurrentSessionUserLikeRecord(entity, currentSessionUserRecord))
    }

    public isPersistInDb = async (id: string): Promise<boolean> => {
        const count = await PostModel.countDocuments({_id: new ObjectId(id)});
        return count > 0;
    }
}

