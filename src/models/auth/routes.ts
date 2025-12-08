import {Router} from "express";
import {inputValidationResultMiddleware} from "../../middleware/input-validation-result-middleware";
import {loginValidationMiddleware} from "./validation/login.dto.validation";
import {loginHandler} from "./handlers/login";
import {authMiddleware} from "../../middleware/auth-middleware";
import {getMeHandler} from "./handlers/getMe";
import {userValidationMiddleware} from "../users/validation/user.dto.validation";
import {registerNewUserHandler} from "./handlers/registerNewUser";
import {confirmRegistrationHandler} from "./handlers/confirmRegistration";
import {emailValidation, stringValidation} from "../../core/validation";
import {registrationEmailResendHandler} from "./handlers/registrationEmailResendHandler";

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

authRouter.post('/registration',
    userValidationMiddleware,
    inputValidationResultMiddleware,
    registerNewUserHandler
)

authRouter.post('/registration-confirmation',
    stringValidation({name: 'code', min: 1}),
    inputValidationResultMiddleware,
    confirmRegistrationHandler,
)

authRouter.post('/registration-email-resending',
    emailValidation({name: 'email', min: 1}),
    inputValidationResultMiddleware,
    registrationEmailResendHandler,
)


export {authRouter};
