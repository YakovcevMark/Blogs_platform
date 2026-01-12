import {injectable} from "inversify";
import {LikeModel} from "../schemas/like.schema";
import {getFilterByIds} from "../../../core/utils/getFilterByIds";

@injectable()
export class LikesRepository {
    async getByUserId(ids: string[], userId: string) {
        if (!ids?.length) return null;
        return LikeModel.findOne({...getFilterByIds(ids), userId });
    }
}
