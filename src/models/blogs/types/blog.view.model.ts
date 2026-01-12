import {BlogInputModel} from "./blog.input.model";

export type BlogViewModel = BlogInputModel & {
    createdAt: string;
    isMembership: boolean;
};