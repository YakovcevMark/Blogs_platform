import {Request, Response} from 'express'
import {sessionDevicesQueryRepository} from "../../../core/index";

export const getSessionDevicesHandler = async (req: Request, res: Response) => {
    const sessions = await sessionDevicesQueryRepository.getAll(req.userId!);
    res.send(sessions)
}