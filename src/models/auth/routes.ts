import {Router} from "express";
import {inputValidationResultMiddleware} from "../../middleware/input-validation-result-middleware";
import {loginValidationMiddleware} from "./validation/login.dto.validation";
import {loginHandler} from "./handlers/login";

const authRouter = Router()

authRouter.post('',
    loginValidationMiddleware,
    inputValidationResultMiddleware,
    loginHandler
)


export {authRouter};
