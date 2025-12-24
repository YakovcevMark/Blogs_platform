import {Request, Response} from 'express'
import {ioc} from "../../../core/index";
import {SessionDevicesQueryRepository} from "../repositories/query-repo";

const sessionDevicesQueryRepository = ioc.get(SessionDevicesQueryRepository)
export const getSessionDevicesHandler = async (req: Request, res: Response) => {
    const sessions = await sessionDevicesQueryRepository.getAll(req.userId!);
    res.send(sessions)
}