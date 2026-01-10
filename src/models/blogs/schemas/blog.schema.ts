import {model, Schema} from "mongoose";

const BlogSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true},
    isMembership: {type: Boolean, required: true},
})
export const BlogModel = model('BlogSchema', BlogSchema);


