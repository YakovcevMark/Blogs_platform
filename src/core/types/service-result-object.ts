import {SERVICE_RESULT_CODES} from "../enums/service-result-codes";
import {FieldError} from "./error-response-type";

export type Result<T = null> = {
    status: SERVICE_RESULT_CODES;
    errorMessage?: string;
    extensions?: FieldError[];
    data?: T;
};