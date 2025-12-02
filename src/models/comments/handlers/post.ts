import {Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../../core/enums/http-status-codes";
import {CommentInputModel} from "../types/comment.input.model";
import {commentsService} from "../application/comments.service";
import {postsQueryRepository} from "../../posts/repositories/query-repo";
import {commentsQueryRepository} from "../repositories/query-repo";

export const createCommentHandler = async (req: Request<{ postId: string }, CommentInputModel>, res: Response) => {
    const isPersistInDb = await postsQueryRepository.isPersistInDb(req.params.postId);

    if (!isPersistInDb) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404)
        return
    }

    const id = await commentsService.create({postId: req.params.postId, body: req.body, user: req.user!});
    const comment = await commentsQueryRepository.getById({id});
    res
        .status(HTTP_STATUS_CODES.CREATED_201)
        .send(comment)
}