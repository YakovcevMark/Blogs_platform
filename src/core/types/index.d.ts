import {Nullable} from "../types";

declare global {
    namespace Express {
        export interface Request {
            userId: Nullable<string>;
            deviceId: Nullable<string>;
        }
    }
}