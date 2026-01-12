import {CommentatorInfo} from "./commentator";

export type CommentDb = {
    content: string;
    createdAt: string;
    commentatorInfo: CommentatorInfo;
    postId: string;
    likesIds: string[]
}