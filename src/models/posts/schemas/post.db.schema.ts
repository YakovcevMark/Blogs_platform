import { model, Schema } from "mongoose";
import { likeSchemaField } from "../../../core/schemas/like.schema";

const NewestLikeSchema = new Schema(
    {
        addedAt: { type: Date, required: true },
        userId: { type: String, required: true },
        login: { type: String, required: true },
    },
    { _id: false }
);

const ExtendedLikesInfoSchema = new Schema(
    {
        likesCount: { type: Number, required: true, default: 0 },
        dislikesCount: { type: Number, required: true, default: 0 },
        newestLikes: { type: [NewestLikeSchema], required: true, default: [] },
    },
    { _id: false }
);

const PostDbSchema = new Schema({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
    extendedLikesInfo: {
        type: ExtendedLikesInfoSchema,
        required: true,
        default: () => ({ likesCount: 0, dislikesCount: 0, newestLikes: [] }),
    },
});

export const PostModel = model("Post", PostDbSchema);

const PostLikeSchema = new Schema(
    {
        ...likeSchemaField,
        postId: { type: String, required: true },
        login: { type: String, required: true },
    },
    { timestamps: true }
);

export const PostLikeModel = model("PostLike", PostLikeSchema);
