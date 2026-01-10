import {CommentDb} from "../types/comment.db.model";
import {RequestEntityId} from "../../../core/types";
import {CommentInputModel} from "../types/comment.input.model";
import {injectable} from "inversify";
import {CommentModel} from "../schemes/comment.db.schema";
import {ObjectId} from "mongodb";

@injectable()
export class CommentsRepository {

    public create = async (dto: CommentDb): Promise<string> => {
        const entity = new CommentModel(dto);
        await entity.save();
        return entity.id;
    }

    public update = async ({body, id}: RequestEntityId & { body: CommentInputModel }): Promise<boolean> => {
        const resp = await CommentModel.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    ...body,
                }
            });

        return resp.modifiedCount > 0;
    }

    public remove = async (id: string): Promise<boolean> => {
        const response = await CommentModel.deleteOne({_id: new ObjectId(id)});
        return response.deletedCount > 0
    }

}
