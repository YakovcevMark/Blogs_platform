import {PostInputModel} from "./post.input.model";
import {HydratedDocument} from "mongoose";

export type PostDbModel = PostInputModel & {
    blogName: string
    createdAt: string;
    extendedLikesInfo: {
        likesCount: number
        dislikesCount: number
        newestLikes: {
            addedAt: Date,
            userId: string
            login: string,
        }[]
    }
}

export type HydratedPost = HydratedDocument<PostDbModel>;