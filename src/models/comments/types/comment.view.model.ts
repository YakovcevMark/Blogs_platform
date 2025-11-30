import {RequestEntityId} from "../../../core/types";
import {CommentatorInfo} from "./commentator";

export type CommentViewModel = RequestEntityId & {
    content: string
    commentatorInfo: CommentatorInfo;
    createdAt: string;
};