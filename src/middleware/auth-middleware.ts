import {NextFunction, Request, Response} from 'express';
import {HTTP_STATUS_CODES} from "../core/enums/http-status-codes";
import {JwtService} from "../core/application/jwt.service";
import {usersQueryRepository} from "../models/users/repositories/query-repo";


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const auth = req.headers['authorization'] as string;
        const token = auth.split(' ')[1];
        const jwtPayload = await JwtService.verifyToken({token})

        if (!jwtPayload?.userId) {
            throw new Error('invalid token');
        }

        const user = await usersQueryRepository.getById({id: jwtPayload.userId})

        if (!user) {
            throw new Error('no user found');
        }

        req.user = user;
        next();
    } catch (err) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    }
};