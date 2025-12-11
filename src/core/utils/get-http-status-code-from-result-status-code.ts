import {SERVICE_RESULT_CODES} from "../enums/service-result-codes";
import {HTTP_STATUS_CODES} from "../enums/http-status-codes";

export const getHttpStatusCodeFromResultStatusCode = (
    code: SERVICE_RESULT_CODES
) => {
    switch (code) {
        case SERVICE_RESULT_CODES.CLIENT_ERROR:
            return HTTP_STATUS_CODES.CLIENT_ERROR_400;
        case SERVICE_RESULT_CODES.FORBIDDEN:
            return HTTP_STATUS_CODES.FORBIDDEN_403;
        case SERVICE_RESULT_CODES.OK:
            return HTTP_STATUS_CODES.OK_200;
        case SERVICE_RESULT_CODES.NOT_FOUND:
            return HTTP_STATUS_CODES.NOT_FOUND_404;
        case SERVICE_RESULT_CODES.UNAUTHORIZED:
            return HTTP_STATUS_CODES.UNAUTHORIZED_401;
        default:
            return 500;
    }
}