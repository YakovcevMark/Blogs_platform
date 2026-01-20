import {PostInputModel} from "../types/post.input.model";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";
import {PostLikeModel, PostModel} from "../schemas/post.db.schema";
import {HydratedPost, PostDbModel} from "../types/post.db.model";
import {HydratedPostLike, PostLikeDb} from "../types/post.like.db";
import {LikeStatus} from "../../../core/enums/like.status.enum";

@injectable()
export class PostsRepository {

    async getById(id: string): Promise<HydratedPost | null> {
        const entity = await PostModel.findOne({_id: new ObjectId(id)})
        if (!entity) {
            return null
        } else {
            return entity;
        }
    }

    async create(dto: PostDbModel): Promise<string> {
        const entity = new PostModel(dto)
        await entity.save()
        return entity.id
    }

    async update(id: string, body: PostInputModel): Promise<boolean> {
        const resp = await PostModel.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    ...body
                },
            }
        );
        return resp.modifiedCount > 0;
    }

    async remove(id: string): Promise<boolean> {
        const response = await PostModel.deleteOne({_id: new ObjectId(id)});
        return response.deletedCount > 0
    }

    async getLikeRecord(postId: string, userId: string): Promise<HydratedPostLike | null> {
        return PostLikeModel.findOne({postId, userId});
    }

    async getLastLikes(postId: string, count:number): Promise<PostLikeDb[]> {
        return PostLikeModel.find({postId, status: LikeStatus.Like}).sort({createdAt: -1}).limit(count).lean();
    }

    async saveLikeRecord(like: HydratedPostLike) {
        await like.save();
    }

    async savePost(post: HydratedPost) {
        await post.save();
    }
}