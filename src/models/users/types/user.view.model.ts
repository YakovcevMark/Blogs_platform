import {RequestEntityId} from "../../../core/types";

export type UserViewModel =  RequestEntityId & {
    login:string;
    email:string;
    createdAt:string;
};