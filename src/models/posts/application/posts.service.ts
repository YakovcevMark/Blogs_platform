import {PostInputModel} from "../types/post.input.model";
import {BlogViewModel} from "../../blogs/types/blog.view.model";
import {inject, injectable} from "inversify";
import {PostsRepository} from "../repositories/db-repository";
import {HydratedPost, PostDbModel} from "../types/post.db.model";
import {LikeStatus} from "../../../core/enums/like.status.enum";
import {Result} from "../../../core/types/service-result-object";
import {SERVICE_RESULT_CODES} from "../../../core/enums/service-result-codes";
import {PostLikeModel} from "../schemas/post.db.schema";
import {UsersRepository} from "../../users/repositories/repo";

@injectable()
export class PostsService {
    constructor(
        @inject(PostsRepository) protected postsRepository: PostsRepository,
        @inject(UsersRepository) protected usersRepository: UsersRepository
    ) {
    }

    private updateLikesInfo(newStatus: LikeStatus, post: HydratedPost, currentStatus?: LikeStatus) {
        if (newStatus === LikeStatus.Like) {
            post.extendedLikesInfo.likesCount++
            if (currentStatus === LikeStatus.Dislike) {
                post.extendedLikesInfo.dislikesCount--
            }
        }
        if (newStatus === LikeStatus.Dislike) {
            post.extendedLikesInfo.dislikesCount++
            if (currentStatus === LikeStatus.Like) {
                post.extendedLikesInfo.likesCount--
            }
        }
        if (newStatus === LikeStatus.None) {
            if (currentStatus === LikeStatus.Dislike) {
                post.extendedLikesInfo.dislikesCount--
            }
            if (currentStatus === LikeStatus.Like) {
                post.extendedLikesInfo.likesCount--
            }
        }
    }

    async create(body: PostInputModel, blog: BlogViewModel): Promise<string> {
        const entity: PostDbModel = {
            blogName: blog!.name,
            createdAt: new Date().toISOString(),
            ...body,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                newestLikes: [],
            }
        }
        return await this.postsRepository.create(entity);
    }

    async update(id: string, body: PostInputModel): Promise<boolean> {
        return await this.postsRepository.update(id, body);
    }

    async remove(id: string): Promise<boolean> {
        return await this.postsRepository.remove(id);
    }

    async changeLikeStatus(postId: string, userId: string, status: LikeStatus): Promise<Result> {
        const post = await this.postsRepository.getById(postId);
        const user = await this.usersRepository.getById(userId);
        if (post === null) {
            return {
                status: SERVICE_RESULT_CODES.NOT_FOUND,
                errorMessage: 'post not found',
                extensions: [{field: 'postId', message: 'not found'}],
            }
        }

        const like = await this.postsRepository.getLikeRecord(postId, userId)
        if (like === null) {
            const createdLike = new PostLikeModel({
                postId,
                userId,
                status,
                login: user!.login,
            })
            await this.postsRepository.saveLikeRecord(createdLike)
            this.updateLikesInfo(status, post)
        } else if (like.status !== status) {
            const currentLikeStatus = like.status;
            like.status = status;
            await this.postsRepository.saveLikeRecord(like)
            this.updateLikesInfo(status, post, currentLikeStatus)
        }

        const likeRecords = await this.postsRepository.getLastLikes(postId, 3);
        post.extendedLikesInfo.newestLikes = likeRecords.map(likeRecords => ({
            addedAt: likeRecords.createdAt,
            login: likeRecords.login,
            userId: likeRecords.userId,
        }))
        post.markModified('extendedLikesInfo');
        await this.postsRepository.savePost(post);
        return {
            status: SERVICE_RESULT_CODES.OK
        }


    }
}

