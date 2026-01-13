import {LikeDB} from "../../../core/types/like.db";

export type CommentLikeDb = LikeDB & {
    commentId: string
}