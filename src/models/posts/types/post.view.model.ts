import {PostInputModel} from "./post.input.model";

export type PostViewModel = PostInputModel &  {
    blogName: string
    createdAt: string;
}