import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {sessionDevicesService} from "../../../core/index";

export const sessionDevicesDeleteHandler = async (req: Request, res: Response) => {
    await sessionDevicesService.removeAllSessionsExceptCurrent(req.deviceId!, req.userId!);
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
}