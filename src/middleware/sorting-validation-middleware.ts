import {query} from "express-validator";
import {SORT_DIRECTIONS} from "../core/enums/sort-directions";
import {NextFunction, Request, Response} from "express";


export const sortingValidationMiddleware =
    (sortByFields?: string[]) => async (req: Request, res: Response, next: NextFunction) => {

        const currentSortByFields = ['createdAt'];
        sortByFields && currentSortByFields.concat(sortByFields);

        await Promise.all([

            query('sortBy')
                .default(currentSortByFields[0])
                .isIn(currentSortByFields)
                .withMessage(`Allowed sort fields: ${currentSortByFields.join(', ')}`)
                .run(req),

            query('sortDirection')
                .default(SORT_DIRECTIONS.DESC)
                .isIn(Object.values(SORT_DIRECTIONS))
                .withMessage(`Allowed sort direction: ${Object.values(SORT_DIRECTIONS).join(', ')}`)
                .run(req),

        ])

        next();
    }