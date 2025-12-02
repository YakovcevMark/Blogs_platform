import {PostViewModel} from "../types/post.view.model";
import {PostInputModel} from "../types/post.input.model";
import {postsCollection} from "../../../db-settings";
import {ObjectId, WithId} from "mongodb";


class PostsRepository {

    public getById = async (id: string): Promise<WithId<PostViewModel> | null> => {
        const entity = await postsCollection.findOne({_id: new ObjectId(id)})
        if (!entity) {
            return null
        } else {
            return entity;
        }
    }

    public create = async (entity: PostViewModel): Promise<string> => {
        const result = await postsCollection.insertOne(entity);
        return String(result.insertedId)
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