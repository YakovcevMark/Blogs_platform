import {BlogViewModel} from "../types/blog.view.model";
import {BlogInputModel} from "../types/blog.input.model";
import {blogsCollection} from "../../../db-settings";
import {ObjectId, WithId} from "mongodb";


class BlogsRepository {

    public getById = async (id: string): Promise<WithId<BlogViewModel> | null> => {
        return await blogsCollection.findOne({_id: new ObjectId(id)})
    }

    public create = async (entity: BlogViewModel): Promise<string> => {
        const result = await blogsCollection.insertOne(entity);
        return String(result.insertedId);
    }

    public update = async (id: string, body: BlogInputModel): Promise<boolean> => {
        const resp = await blogsCollection.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    ...body
                },
            }
        );
        return resp.modifiedCount > 0;
    }

    public remove = async (id: string): Promise<boolean> => {
        const response = await blogsCollection.deleteOne({_id: new ObjectId(id)});
        return response.deletedCount > 0
    }

    public clearDB = async () => {
        await blogsCollection.deleteMany()
    }

}


const blogsRepository = new BlogsRepository();

export {
    blogsRepository,
};