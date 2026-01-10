import {PostViewModel} from "../types/post.view.model";
import {PostInputModel} from "../types/post.input.model";
import {ObjectId, WithId} from "mongodb";
import {injectable} from "inversify";
import {PostModel} from "../schemas/post.db.schema";

@injectable()
export class PostsRepository {

    public getById = async (id: string): Promise<WithId<PostViewModel> | null> => {
        const entity = await PostModel.findOne({_id: new ObjectId(id)})
        if (!entity) {
            return null
        } else {
            return entity;
        }
    }

    public create = async (dto: PostViewModel): Promise<string> => {
        const entity = new PostModel(dto)
        await entity.save()
        return entity.id
    }

    public update = async (id: string, body: PostInputModel): Promise<boolean> => {
        const resp = await PostModel.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    ...body
                },
            }
        );
        return resp.modifiedCount > 0;
    }

    public remove = async (id: string): Promise<boolean> => {
        const response = await PostModel.deleteOne({_id: new ObjectId(id)});
        return response.deletedCount > 0
    }

}