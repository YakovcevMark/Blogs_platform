import {CommentDb} from "../types/comment.db.model";
import {CommentInputModel} from "../types/comment.input.model";
import {RequestEntityId} from "../../../core/types";
import {Result} from "../../../core/types/service-result-object";
import {SERVICE_RESULT_CODES} from "../../../core/enums/service-result-codes";
import {formatErrors} from "../../../middleware/input-validation-result-middleware";
import {PostsRepository} from "../../posts/repositories/db-repository";
import {inject, injectable} from "inversify";
import {UsersRepository} from "../../users/repositories/repo";
import {CommentsRepository} from "../repositories/repo";
import {CommentModel} from "../schemes/comment.db.schema";
import {ObjectId} from "mongodb";
import {LikesRepository} from "../../likes/repositories/likes.repository";
import {LikeModel} from "../../likes/schemas/like.schema";
import {LikeStatus} from "../../likes/enums/like.status.enum";

@injectable()
export class CommentsService {
    constructor(
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(PostsRepository) protected postsRepository: PostsRepository,
        @inject(CommentsRepository) protected commentsRepository: CommentsRepository,
        @inject(LikesRepository) protected likesRepository: LikesRepository,
    ) {
    }

    public create = async (params: {
        userId: string,
        body: CommentInputModel,
        postId: string
    }): Promise<Result<{ createdCommentId: string } | null>> => {

        const {postId, userId, body} = params;

        const post = await this.postsRepository.getById(postId);
        if (!post) {
            return {
                status: SERVICE_RESULT_CODES.NOT_FOUND,
                errorMessage: 'no post found',
                extensions: [formatErrors({msg: 'no post found', path: 'postId'})],
            }
        }

        const user = await this.usersRepository.getById(userId);
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
            likesIds: [],
            postId
        }

        const createdCommentId = await this.commentsRepository.create(entity);

        if (!createdCommentId) {
            return {
                status: SERVICE_RESULT_CODES.SERVER_ERROR,
                errorMessage: 'cannot create comment',
                extensions: [formatErrors({msg: 'cannot create comment', path: 'null'})],
            }
        }

        return {
            status: SERVICE_RESULT_CODES.OK,
            data: {createdCommentId}
        }
    }

    public update = async (params: RequestEntityId & {
        body: CommentInputModel,
    }): Promise<boolean> => {
        return await this.commentsRepository.update(params)
    }

    public remove = async (id: string): Promise<boolean> => {
        return await this.commentsRepository.remove(id);
    }

    async changeLikeStatus(commentId: string, userId: string, status: LikeStatus): Promise<Result> {
        const comment = await CommentModel.findById(new ObjectId(commentId));

        if (comment === null) {
            return {
                status: SERVICE_RESULT_CODES.NOT_FOUND,
                errorMessage: 'comment not found',
                extensions: [{field: 'commentId', message: 'not found'}],
            }
        }

        const like = await this.likesRepository.getByUserId(comment.likesIds, userId)
        if (like === null) {
            const createdLike = new LikeModel({
                userId,
                status
            })
            await createdLike.save();
            comment.likesIds.push(createdLike.id);
            comment.markModified('likesIds')
            await comment.save();
        } else if (like.status !== status) {
            like.status = status;
            like.markModified('status');
            await like.save();
        }


        return {
            status: SERVICE_RESULT_CODES.OK
        }


    }

}

