import {Request, Response} from "express";
import {RequestEntityId} from "../../../core/types";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {commentsService} from "../application/comments.service";

export const deleteCommentHandler = async (req: Request<{ commentId: string }>, res: Response) => {
    const isRemoved = await commentsService.remove(req.params.commentId);
    res.sendStatus(
        isRemoved
            ? HTTP_STATUS_CODES.NO_CONTENT_204
            : HTTP_STATUS_CODES.NOT_FOUND_404
    )
}