import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {CommentsService} from "../application/comments.service";
import {ioc} from "../../../core/index";
import {LikeStatus} from "../../../core/enums/like.status.enum";
import {SERVICE_RESULT_CODES} from "../../../core/enums/service-result-codes";
import {getHttpStatusCodeFromResultStatusCode} from "../../../core/utils/get-http-status-code-from-result-status-code";
import {getErrorRespond} from "../../../middleware/input-validation-result-middleware";

const commentsService = ioc.get(CommentsService)
export const changeCommentLikeStatusHandler = async (req: Request<{ commentId: string }, { likeStatus:LikeStatus }>, res: Response) => {
    const result = await commentsService.changeLikeStatus(req.params.commentId, req.userId!, req.body.likeStatus);

    if (result.status === SERVICE_RESULT_CODES.OK) {
        res
            .sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
        return
    }
    res.status(getHttpStatusCodeFromResultStatusCode(result.status)).send(getErrorRespond(result.extensions));
}