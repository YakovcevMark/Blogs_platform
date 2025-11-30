import {Nullable} from "../types";
import {UserViewModel} from "../../models/users/types/user.view.model";

declare global {
    namespace Express {
        export interface Request {
            user: Nullable<UserViewModel>
        }
    }
}