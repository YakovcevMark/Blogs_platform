import {NextFunction, Request, Response} from "express";
import {query} from "express-validator";

const createSearchParamsMiddleware = <T>(searchParams: Array<keyof T>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(
            searchParams.map((searchParam) => (
                query(searchParam as string)
                    .default('')
                    .run(req)
            ))
        )
        next();
    }