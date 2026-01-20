import {LikeDB} from "../../../core/types/like.db";
import {HydratedDocument} from "mongoose";

export type PostLikeDb = LikeDB & {
    postId: string
    login: string
    createdAt: Date
}
export type HydratedPostLike = HydratedDocument<PostLikeDb>