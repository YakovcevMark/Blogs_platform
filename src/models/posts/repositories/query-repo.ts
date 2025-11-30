import {postsCollection} from "../../../db-settings";
import {ObjectId, WithId} from "mongodb";
import {getMongoViewModel} from "../../../core/utils/get-view-model";
import {PostViewModel} from "../types/post.view.model";
import {PostsQueryList} from "../types/posts.query.list";
import {getDbFilters} from "../../../core/utils/get-db-filters";
import {getSortDbDirection} from "../../../core/utils/get-sort-db-direction";
import {getSkipDbValue} from "../../../core/utils/get-skip-db-value";


export class PostsQueryRepository {

    public getAll = async (params: PostsQueryList): Promise<WithId<PostViewModel>[]> => {
        const {sortBy, sortDirection, pageSize, pageNumber, blogId} = params;

        return await postsCollection
            .find(getDbFilters<PostViewModel>([{fieldName: 'blogId', queryParam: blogId}]))
            .sort(sortBy, getSortDbDirection(sortDirection))
            .skip(getSkipDbValue({pageSize, pageNumber}))
            .limit(pageSize)
            .toArray()
    }

    public getCount = async (params: Pick<PostsQueryList, 'blogId'>): Promise<number> => {
        const {blogId} = params
        return await postsCollection.countDocuments(
            getDbFilters<PostViewModel>([{
                fieldName: 'blogId',
                queryParam: blogId
            }])
        );
    }

    public getById = async (id: string): Promise<WithId<PostViewModel> | null> => {
        return await postsCollection.findOne({_id: new ObjectId(id)})
    }

    public isPersistInDb = async (id: string): Promise<boolean> => {
        const count = await postsCollection.countDocuments({_id: new ObjectId(id)});
        return count > 0;
    }

    static getViewModel = (post: WithId<PostViewModel>): PostViewModel => {
        const postDB = getMongoViewModel(post)
        return {
            id: postDB.id,
            title: postDB.title,
            blogId: postDB.blogId,
            shortDescription: postDB.shortDescription,
            content: postDB.content,
            createdAt: postDB.createdAt,
            blogName: postDB.blogName,
        }
    }
}


const postsQueryRepository = new PostsQueryRepository();

export {
    postsQueryRepository,
};