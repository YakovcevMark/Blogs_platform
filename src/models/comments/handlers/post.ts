import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {CommentInputModel} from "../types/comment.input.model";
import {commentsService} from "../application/comments.service";

export const createCommentHandler = async (req: Request<{ postId: string }, CommentInputModel>, res: Response) => {
    const comment = await commentsService.create({postId: req.params.postId, body: req.body, user: req.user!});
    res
        .status(HTTP_STATUS_CODES.CREATED_201)
        .send(comment)
}