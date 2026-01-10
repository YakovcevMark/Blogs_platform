import {model, Schema} from "mongoose";
import {PostViewModel} from "../types/post.view.model";

const PostDbSchema = new Schema<PostViewModel>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    id: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
})
export const PostModel = model('PostDbSchema', PostDbSchema)