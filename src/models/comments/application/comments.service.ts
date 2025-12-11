import {commentsRepository} from "../repositories/repo";
import {CommentDb} from "../types/comment.db.model";
import {CommentInputModel} from "../types/comment.input.model";
import {RequestEntityId} from "../../../core/types";
import {Result} from "../../../core/types/service-result-object";
import {usersRepository} from "../../../core/index";
import {SERVICE_RESULT_CODES} from "../../../core/enums/service-result-codes";
import {formatErrors} from "../../../middleware/input-validation-result-middleware";
import {postsRepository} from "../../posts/repositories/db-repository";

class CommentsService {

    public create = async (params: {
        userId: string,
        body: CommentInputModel,
        postId: string
    }): Promise<Result<{ createdCommentId: string } | null>> => {

        const { postId, userId, body } = params;

        const post = await postsRepository.getById(postId);
        if (!post) {
            return {
                status: SERVICE_RESULT_CODES.NOT_FOUND,
                errorMessage: 'no post found',
                extensions: [formatErrors({msg: 'no post found', path: 'postId'})],
            }
        }

        const user = await usersRepository.getById(userId);
        if (!user) {
            return {
                status: SERVICE_RESULT_CODES.UNAUTHORIZED,
                errorMessage: 'no user found',
                extensions: [formatErrors({msg: 'no user found', path: 'user'})],
            }
        }

        const entity: CommentDb = {
            createdAt: new Date().toISOString(),
            commentatorInfo: {
                userId: userId,
                userLogin: user.login
            },
            content: body.content,
            postId
        }

        const createdCommentId = await commentsRepository.create(entity);

        if (!createdCommentId) {
            return {
                status: SERVICE_RESULT_CODES.SERVER_ERROR,
                errorMessage: 'cannot create comment',
                extensions: [formatErrors({msg: 'cannot create comment', path: 'null'})],
            }
        }

        return {
            status: SERVICE_RESULT_CODES.OK,
            data: { createdCommentId }
        }
    }

    public update = async (params: RequestEntityId & {
        body: CommentInputModel,
    }): Promise<boolean> => {
        return await commentsRepository.update(params)
    }

    public remove = async (id: string): Promise<boolean> => {
        return await commentsRepository.remove(id);
    }

    public clearDB = async () => {
        return await commentsRepository.clearDB();
    }

}

const commentsService = new CommentsService();

export {
    commentsService
}