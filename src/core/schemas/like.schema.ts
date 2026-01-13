import {LikeStatus} from "../enums/like.status.enum";

export const likeSchemaField = {
    userId: {type: String, required: true},
    status: {type: String, enum: LikeStatus, required: true},
}

