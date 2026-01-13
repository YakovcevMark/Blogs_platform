import {CommentDb} from "../types/comment.db.model";
import {RequestEntityId} from "../../../core/types";
import {injectable} from "inversify";
import {CommentLikeModel, CommentModel} from "../schemes/comment.db.schema";
import {ObjectId} from "mongodb";
import {CommentLikeDb} from "../types/comment.like.db";
import {HydratedDocument} from "mongoose";

@injectable()
export class CommentsRepository {
    async getById(id: string): Promise<HydratedDocument<CommentDb> | null> {
        return CommentModel.findById(id);
    }

    async create(dto: CommentDb): Promise<string> {
        const entity = new CommentModel(dto);
        await entity.save();
        return entity.id;
    }

    async update({body, id}: RequestEntityId & { body: Partial<CommentDb> }): Promise<boolean> {
        const resp = await CommentModel.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    ...body,
                }
            });

        return resp.modifiedCount > 0;
    }

    async remove(id: string): Promise<boolean> {
        const response = await CommentModel.deleteOne({_id: new ObjectId(id)});
        return response.deletedCount > 0
    }

    async getLikeRecord(commentId: string, userId: string): Promise<HydratedDocument<CommentLikeDb> | null> {
        return CommentLikeModel.findOne({commentId, userId})
    }

    async saveLikeRecord(like: HydratedDocument<CommentLikeDb>) {
        await like.save();
    }
}
