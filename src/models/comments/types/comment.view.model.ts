import {RequestEntityId} from "../../../core/types";
import {CommentatorInfo} from "./commentator";
import {LikeStatus} from "../../../core/enums/like.status.enum";

export type CommentViewModel = RequestEntityId & {
    content: string
    commentatorInfo: CommentatorInfo;
    createdAt: string;
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: LikeStatus
    }
};