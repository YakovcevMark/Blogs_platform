import {BlogViewModel} from "../types/blog.view.model";
import {BlogInputModel} from "../types/blog.input.model";
import {ObjectId, WithId} from "mongodb";
import {injectable} from "inversify";
import {BlogModel} from "../schemas/blog.schema";

@injectable()
export class BlogsRepository {

    public getById = async (id: string): Promise<WithId<BlogViewModel> | null> => {
        return BlogModel.findOne({_id: new ObjectId(id)}).lean()
    }

    public create = async (dto: BlogViewModel): Promise<string> => {
        const entity = new BlogModel(dto);
        await entity.save();
        return entity.id
    }

    public update = async (id: string, body: BlogInputModel): Promise<boolean> => {
        const resp = await BlogModel.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    ...body
                },
            }
        );
        return resp.modifiedCount > 0;
    }

    public remove = async (id: string): Promise<boolean> => {
        const response = await BlogModel.deleteOne({_id: new ObjectId(id)});
        return response.deletedCount > 0
    }

}


