import {BlogViewModel} from "../types/blog.view.model";
import {ObjectId, WithId} from "mongodb";
import {BlogsQueryList} from "../types/blogs.query.list";
import {getSortDbDirection} from "../../../core/utils/get-sort-db-direction";
import {getSkipDbValue} from "../../../core/utils/get-skip-db-value";
import {getDbFilters} from "../../../core/utils/get-db-filters";
import {getMongoViewModel} from "../../../core/utils/get-view-model";
import {getPagesCount} from "../../../core/utils/get-pages-count";
import {PaginatorOutput} from "../../../core/types/paginator.output";
import {injectable} from "inversify";
import {BlogModel} from "../schemas/blog.schema";

@injectable()
export class BlogsQueryRepository {

    static getViewModel = (blog: WithId<BlogViewModel>): BlogViewModel => {
        const blogDB = getMongoViewModel(blog)
        return {
            id: blogDB.id,
            name: blogDB.name,
            createdAt: blogDB.createdAt,
            isMembership: blogDB.isMembership,
            description: blogDB.description,
            websiteUrl: blogDB.websiteUrl,
        }
    }

    public getAll = async (params: BlogsQueryList): Promise<PaginatorOutput<BlogViewModel>> => {
        const {searchNameTerm, sortBy, sortDirection, pageSize, pageNumber} = params;

        const items = await BlogModel
            .find(getDbFilters<BlogViewModel>([{fieldName: 'name', queryParam: searchNameTerm}]))
            .sort({[sortBy]:  getSortDbDirection(sortDirection)})
            .skip(getSkipDbValue({pageSize, pageNumber}))
            .limit(pageSize)
            .lean()

        const totalCount = await this.getCount({searchNameTerm});

        return {
            pageSize,
            items: items.map(getMongoViewModel),
            page: pageNumber,
            pagesCount: getPagesCount({pageSize, totalCount}),
            totalCount
        }
    }

    public getCount = async (params: Partial<Pick<BlogsQueryList, 'searchNameTerm'>>): Promise<number> => {
        const {searchNameTerm} = params;
        return  BlogModel.countDocuments(getDbFilters<BlogViewModel>([{
            fieldName: 'name',
            queryParam: searchNameTerm
        }]));
    }

    public isPersistInDb = async (id: string): Promise<boolean> => {
        const count = await BlogModel.countDocuments({_id: new ObjectId(id)});
        return count > 0;
    }

    public getById = async (id: string): Promise<BlogViewModel | null> => {
        const blog = await BlogModel.findOne({_id: new ObjectId(id)})
        if (!blog) return null;
        return BlogsQueryRepository.getViewModel(blog);
    }
}


