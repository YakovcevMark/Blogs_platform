import {PostViewModel} from "../types/post.view.model";
import {PostInputModel} from "../types/post.input.model";
import {postsCollection} from "../../../db-settings";
import {ObjectId, WithId} from "mongodb";
import {getSortDbDirection} from "../../../core/utils/get-sort-db-direction";
import {getSkipDbValue} from "../../../core/utils/get-skip-db-value";
import {PostsQueryList} from "../types/posts.query.list";
import {getDbFilters} from "../../../core/utils/get-db-filters";


class PostsRepository {

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

    public create = async (entity: PostViewModel): Promise<WithId<PostViewModel>> => {
        const result = await postsCollection.insertOne(entity);
        return {...entity, _id: result.insertedId}
    }

    public update = async (id: string, body: PostInputModel): Promise<boolean> => {
        const resp = await postsCollection.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    ...body
                },
            }
        );
        return resp.modifiedCount > 0;
    }

    public remove = async (id: string): Promise<boolean> => {
        const response = await postsCollection.deleteOne({_id: new ObjectId(id)});
        return response.deletedCount > 0
    }

    public clearDB = async () => {
        await postsCollection.deleteMany()
    }

}


const postsRepository = new PostsRepository();

export {
    postsRepository,
};