import {Request, Response} from "express";
import {RequestEntityId} from "../../../core/types";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {SERVICE_RESULT_CODES} from "../../../core/enums/service-result-codes";
import {getHttpStatusCodeFromResultStatusCode} from "../../../core/utils/get-http-status-code-from-result-status-code";
import {getErrorRespond} from "../../../middleware/input-validation-result-middleware";
import {ioc} from "../../../core/index";
import {SessionDevicesService} from "../application/session-device.service";

const sessionDevicesService = ioc.get(SessionDevicesService)
export const deleteSessionDeviceHandler = async (req: Request<RequestEntityId>, res: Response) => {
    const result = await sessionDevicesService.remove(req.params.id, req.userId!);

    if (result.status == SERVICE_RESULT_CODES.OK) {
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
        return;
    }

    res.status(getHttpStatusCodeFromResultStatusCode(result.status)).send(getErrorRespond(result.extensions))
}