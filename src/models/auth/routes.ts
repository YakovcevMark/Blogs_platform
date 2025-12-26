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
import {refreshTokenHandler} from "./handlers/refreshToken";
import {logoutHandler} from "./handlers/logout";
import {checkRefreshTokenMiddleware} from "../../middleware/check-refresh-token-middleware";
import {rateLimitMiddleware} from "../../middleware/rate-limit-middleware";
import {newPasswordHandler} from "./handlers/new-password-handler";
import {passwordRecoveryHandler} from "./handlers/password-recovery";

const authRouter = Router()

authRouter.post('/login',
    loginValidationMiddleware,
    inputValidationResultMiddleware,
    rateLimitMiddleware,
    loginHandler
)

authRouter.post('/password-recovery',
    emailValidation({name: 'email', min: 1}),
    inputValidationResultMiddleware,
    rateLimitMiddleware,
    passwordRecoveryHandler,
)
authRouter.post('/new-password',
    stringValidation({name: 'recoveryCode', min: 1}),
    stringValidation({name: 'newPassword', min: 6, max: 20}),
    inputValidationResultMiddleware,
    rateLimitMiddleware,
    newPasswordHandler,
)

authRouter.get('/me',
    authMiddleware,
    getMeHandler
)

authRouter.post('/registration',
    userValidationMiddleware,
    inputValidationResultMiddleware,
    rateLimitMiddleware,
    registerNewUserHandler
)

authRouter.post('/registration-confirmation',
    stringValidation({name: 'code', min: 1}),
    inputValidationResultMiddleware,
    rateLimitMiddleware,
    confirmRegistrationHandler,
)

authRouter.post('/registration-email-resending',
    emailValidation({name: 'email', min: 1}),
    inputValidationResultMiddleware,
    rateLimitMiddleware,
    registrationEmailResendHandler,
)

authRouter.post('/refresh-token',
    checkRefreshTokenMiddleware,
    refreshTokenHandler,
)

authRouter.post('/logout',
    checkRefreshTokenMiddleware,
    logoutHandler,
)


export {authRouter};
