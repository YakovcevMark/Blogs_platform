import {model, Schema} from "mongoose";
import {LikeStatus} from "../enums/like.status.enum";
import {LikeDB} from "../types/like.db";

const LikeSchema = new Schema<LikeDB>({
    userId: {type: String, required: true},
    status: {type: String, enum: LikeStatus, required: true},
}, {timestamps: true})

export const LikeModel = model('LikeSchema', LikeSchema)