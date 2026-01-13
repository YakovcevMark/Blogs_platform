import {LikeStatus} from "../enums/like.status.enum";

export type LikeDB = {
    userId: string
    status: LikeStatus
}