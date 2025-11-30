import {Router} from "express";
import {inputValidationResultMiddleware} from "../../middleware/input-validation-result-middleware";
import {loginValidationMiddleware} from "./validation/login.dto.validation";
import {loginHandler} from "./handlers/login";
import {authMiddleware} from "../../middleware/auth-middleware";
import {getMeHandler} from "./handlers/get.me";

const authRouter = Router()

authRouter.post('/login',
    loginValidationMiddleware,
    inputValidationResultMiddleware,
    loginHandler
)

authRouter.get('/me',
    authMiddleware,
    getMeHandler
)


export {authRouter};
