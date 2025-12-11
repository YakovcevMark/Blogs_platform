import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {CommentInputModel} from "../types/comment.input.model";
import {commentsService} from "../application/comments.service";
import {commentsQueryRepository} from "../repositories/query-repo";
import {SERVICE_RESULT_CODES} from "../../../core/enums/service-result-codes";
import {getHttpStatusCodeFromResultStatusCode} from "../../../core/utils/get-http-status-code-from-result-status-code";
import {getErrorRespond} from "../../../middleware/input-validation-result-middleware";

export const createCommentHandler = async (req: Request<{ postId: string }, CommentInputModel>, res: Response) => {
    const result = await commentsService.create({postId: req.params.postId, body: req.body, userId: req.userId!});

    if (result.status === SERVICE_RESULT_CODES.OK) {
        const comment = await commentsQueryRepository.getById({id: result.data!.createdCommentId});
        res
            .status(HTTP_STATUS_CODES.CREATED_201)
            .send(comment)
        return
    }

    res.status(getHttpStatusCodeFromResultStatusCode(result.status)).send(getErrorRespond(result.extensions))

}