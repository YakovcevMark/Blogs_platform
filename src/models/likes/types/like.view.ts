import {LikeStatus} from "../enums/like.status.enum";

export type LikeView = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus;
}