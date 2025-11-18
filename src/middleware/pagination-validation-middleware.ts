import {query} from "express-validator";
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from "../core/constants/pagination";
import {NextFunction, Request, Response} from "express";


export const paginationValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    await Promise.all([
        query('pageNumber')
            .default(DEFAULT_PAGE_NUMBER)
            .isInt({min: 1})
            .withMessage('pageNumber must be a positive integer')
            .toInt()
            .run(req),

        query('pageSize')
            .default(DEFAULT_PAGE_SIZE)
            .isInt({min: 1, max: 100})
            .withMessage('pageSize must be a positive integer between 1 and 100')
            .toInt()
            .run(req),
    ])

    next();
}
