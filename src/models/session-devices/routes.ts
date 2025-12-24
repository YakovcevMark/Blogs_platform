import {Router} from "express";
import {inputValidationResultMiddleware} from "../../middleware/input-validation-result-middleware";
import {idValidation} from "../../core/validation";
import {getSessionDevicesHandler} from "./handlers/get";
import {sessionDevicesDeleteHandler} from "./handlers/delete";
import {deleteSessionDeviceHandler} from "./handlers/deleteById";
import {checkRefreshTokenMiddleware} from "../../middleware/check-refresh-token-middleware";


const sessionDevicesRouter = Router()

sessionDevicesRouter.get('',
    checkRefreshTokenMiddleware,
    getSessionDevicesHandler
)

sessionDevicesRouter.delete('',
    checkRefreshTokenMiddleware,
    sessionDevicesDeleteHandler
)

sessionDevicesRouter.delete('/:id',
    idValidation({isMongoId: false}),
    checkRefreshTokenMiddleware,
    inputValidationResultMiddleware,
    deleteSessionDeviceHandler
)


export {sessionDevicesRouter};