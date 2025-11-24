import {Router} from "express";
import {inputValidationResultMiddleware} from "../../middleware/input-validation-result-middleware";
import {superAdminGuardMiddleware} from "../../middleware/super-admin-guard-middleware";
import {paginationValidationMiddleware} from "../../middleware/pagination-validation-middleware";
import {sortingValidationMiddleware} from "../../middleware/sorting-validation-middleware";
import {idValidation} from "../../core/validation";
import {getUsersHandler} from "./handlers/get";
import {deleteUserHandler} from "./handlers/delete";
import {userValidationMiddleware} from "./validation/user.dto.validation";
import {createUserHandler} from "./handlers/post";


const usersRouter = Router()

usersRouter.get('',
    superAdminGuardMiddleware,
    paginationValidationMiddleware,
    sortingValidationMiddleware(['login', 'email']),
    inputValidationResultMiddleware,
    getUsersHandler
)


usersRouter.post('',
    superAdminGuardMiddleware,
    userValidationMiddleware,
    inputValidationResultMiddleware,
    createUserHandler
)


usersRouter.delete('/:id',
    superAdminGuardMiddleware,
    idValidation({name: 'id', type: 'param'}),
    inputValidationResultMiddleware,
    deleteUserHandler
)


export {usersRouter};