import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {ioc} from "../../../core/index";
import {SessionDevicesService} from "../application/session-device.service";

const sessionDevicesService = ioc.get(SessionDevicesService)

export const sessionDevicesDeleteHandler = async (req: Request, res: Response) => {
    await sessionDevicesService.removeAllSessionsExceptCurrent(req.deviceId!, req.userId!);
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
}