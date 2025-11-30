import {commentsCollection} from "../../../db-settings";
import {ObjectId, WithId} from "mongodb";
import {CommentDb} from "../types/comment.db.model";
import {RequestEntityId} from "../../../core/types";
import {CommentInputModel} from "../types/comment.input.model";


class CommentsRepository {

    public create = async (entity: CommentDb): Promise<WithId<CommentDb>> => {
        const result = await commentsCollection.insertOne(entity);
        return {...entity, _id: result.insertedId};
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

    public clearDB = async () => {
        await commentsCollection.deleteMany()
    }

}


const commentsRepository = new CommentsRepository();

export {
    commentsRepository,
};