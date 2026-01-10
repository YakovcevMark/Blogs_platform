import {ObjectId, WithId} from "mongodb";
import {getMongoViewModel} from "../../../core/utils/get-view-model";
import {PostViewModel} from "../types/post.view.model";
import {PostsQueryList} from "../types/posts.query.list";
import {getDbFilters} from "../../../core/utils/get-db-filters";
import {getSortDbDirection} from "../../../core/utils/get-sort-db-direction";
import {getSkipDbValue} from "../../../core/utils/get-skip-db-value";
import {PaginatorOutput} from "../../../core/types/paginator.output";
import {getPagesCount} from "../../../core/utils/get-pages-count";
import {injectable} from "inversify";
import {PostModel} from "../schemas/post.db.schema";

@injectable()
export class PostsQueryRepository {

    static getViewModel = (post: WithId<PostViewModel>): PostViewModel => {
        const postDB = getMongoViewModel(post)
        return {
            id: postDB.id,
            title: postDB.title,
            blogId: postDB.blogId,
            shortDescription: postDB.shortDescription,
            content: postDB.content,
            createdAt: postDB.createdAt,
            blogName: postDB.blogName,
        }
    }

    public getAll = async (params: PostsQueryList): Promise<PaginatorOutput<PostViewModel>> => {
        const {sortBy, sortDirection, pageSize, pageNumber, blogId} = params;

        const items = await PostModel
            .find(getDbFilters<PostViewModel>([{fieldName: 'blogId', queryParam: blogId}]))
            .sort({[sortBy]: getSortDbDirection(sortDirection)})
            .skip(getSkipDbValue({pageSize, pageNumber}))
            .limit(pageSize)
            .lean()

        const totalCount = await this.getCount({blogId})

        return {
            pageSize,
            items: items.map(getMongoViewModel),
            page: pageNumber,
            pagesCount: getPagesCount({pageSize, totalCount}),
            totalCount
        }
    }

    public getCount = async (params: Pick<PostsQueryList, 'blogId'>): Promise<number> => {
        const {blogId} = params
        return PostModel.countDocuments(
            getDbFilters<PostViewModel>([{
                fieldName: 'blogId',
                queryParam: blogId
            }])
        );
    }

    public getById = async (id: string): Promise<PostViewModel | null> => {
        const entity = await PostModel.findOne({_id: new ObjectId(id)}).lean()
        if (!entity) return null;
        return PostsQueryRepository.getViewModel(entity)
    }

    public isPersistInDb = async (id: string): Promise<boolean> => {
        const count = await PostModel.countDocuments({_id: new ObjectId(id)});
        return count > 0;
    }
}

