import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {HTTP_STATUS_CODES} from "../core/enums/http-status-codes";
import {FieldValidationError} from "express-validator/lib/base";
import {FieldError} from "../core/types/error-response-type";

const formatErrors = (error: FieldValidationError): FieldError => ({
    field: error.path,  // Поле с ошибкой
    message: error.msg,  // Сообщение ошибки
});

export const inputValidationResultMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req)
        .formatWith((error) => formatErrors(error as FieldValidationError))
        .array({ onlyFirstError: true });

    if (errors.length) {
        return res.status(HTTP_STATUS_CODES.CLIENT_ERROR_400).json({errorsMessages: errors});
    }

    next(); // Если ошибок нет, передаём управление дальше
};