import {commentsCollection} from "../../../db-settings";
import {ObjectId} from "mongodb";
import {CommentDb} from "../types/comment.db.model";
import {RequestEntityId} from "../../../core/types";
import {CommentInputModel} from "../types/comment.input.model";
import {injectable} from "inversify";

@injectable()
export class CommentsRepository {

    public create = async (entity: CommentDb): Promise<string> => {
        const result = await commentsCollection.insertOne(entity);
        return String(result.insertedId);
    }

    public update = async ({body, id}: RequestEntityId & { body: CommentInputModel }): Promise<boolean> => {
        const resp = await commentsCollection.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    ...body,
                }
            });

        return resp.modifiedCount > 0;
    }

    public remove = async (id: string): Promise<boolean> => {
        const response = await commentsCollection.deleteOne({_id: new ObjectId(id)});
        return response.deletedCount > 0
    }

}
