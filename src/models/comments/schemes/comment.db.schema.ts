import {model, Schema} from "mongoose";

const CommentatorInfoScheme = new Schema({
    userId: {type: String, required: true},
    userLogin: {type: String, required: true}
}, {_id: false})

const CommentScheme = new Schema({
    content: {type: String, required: true},
    createdAt: {type: String, required: true},
    commentatorInfo: {type: CommentatorInfoScheme, required: true},
    postId: {type: String, required: true},
    likesIds: {type: [String], required: true, default:[]},
})
export const CommentModel = model('CommentScheme', CommentScheme);
