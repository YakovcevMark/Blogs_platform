import {injectable} from "inversify";
import {LikeModel} from "../schemas/like.schema";
import {LikeStatus} from "../enums/like.status.enum";
import {getFilterByIds} from "../../../core/utils/getFilterByIds";

@injectable()
export class LikesQueryRepository {

    private getCountOfDocuments(ids: string[], status: LikeStatus): Promise<number> {
        return LikeModel.countDocuments(getFilterByIds(ids)).where('status').equals(status)
    }
    async getStatusByUserId(ids: string[], userId: string): Promise<LikeStatus> {
        if (!userId || ids.length === 0) {
            return LikeStatus.None
        }
        const result = await LikeModel.findOne({...getFilterByIds(ids), userId}).lean();
        if (result === null) {
            return LikeStatus.None
        }
        return result.status;
    }

    async getLikesCount(ids: string[]): Promise<number> {
        return this.getCountOfDocuments(ids, LikeStatus.Like)
    }

    async getDislikesCount(ids: string[]): Promise<number> {
        return this.getCountOfDocuments(ids, LikeStatus.Dislike)
    }
}
