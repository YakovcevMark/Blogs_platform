import {PostViewModel} from "../types/post.view.model";
import {PostInputModel} from "../types/post.input.model";
import {postsCollection} from "../../../db-settings";
import {ObjectId, WithId} from "mongodb";


class PostsRepository {

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