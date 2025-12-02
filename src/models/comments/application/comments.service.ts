import {commentsRepository} from "../repositories/repo";
import {CommentDb} from "../types/comment.db.model";
import {CommentInputModel} from "../types/comment.input.model";
import {UserViewModel} from "../../users/types/user.view.model";
import {RequestEntityId} from "../../../core/types";

class CommentsService {

    public create = async (params: {
        user: UserViewModel,
        body: CommentInputModel,
        postId: string
    }): Promise<string> => {

        const {postId, user, body} = params;

        const entity: CommentDb = {
            createdAt: new Date().toISOString(),
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login
            },
            content: body.content,
            postId
        }
        return await commentsRepository.create(entity);
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