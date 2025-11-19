import {paginationValidationMiddleware} from "../../../middleware/pagination-validation-middleware";
import {sortingValidationMiddleware} from "../../../middleware/sorting-validation-middleware";

export const postsQueryMiddleware = [
    paginationValidationMiddleware,
    sortingValidationMiddleware(['blogName']),
]