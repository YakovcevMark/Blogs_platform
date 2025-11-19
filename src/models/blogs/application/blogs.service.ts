import {BlogViewModel} from "../types/blog.view.model";
import {PaginatorOutput} from "../../../core/types/paginator.output";
import {blogsRepository} from "../repositories/db-repository";
import {BlogsQueryList} from "../types/blogs.query.list";
import {getMongoViewModel} from "../../../core/utils/get-view-model";
import {getPagesCount} from "../../../core/utils/get-pages-count";
import {BlogInputModel} from "../types/blog.input.model";

class BlogsService {

    public getAll = async (params: BlogsQueryList): Promise<PaginatorOutput<BlogViewModel>> => {
        const {searchNameTerm, pageSize, pageNumber} = params;
        const items = await blogsRepository.getAll(params)
        const totalCount = await blogsRepository.getCount({searchNameTerm});

        return {
            pageSize,
            items: items.map(getMongoViewModel),
            page: pageNumber,
            pagesCount: getPagesCount({pageSize, totalCount}),
            totalCount
        }

    }

    public getById = async (id: string): Promise<BlogViewModel | null> => {
       const entity =  await blogsRepository.getById(id);
        if (!entity) {
            return null
        } else {
            return getMongoViewModel(entity);
        }
    }

    public isPersistInDb = async (id: string): Promise<boolean> => {
        return await blogsRepository.isPersistInDb(id);
    }

    public create = async (body: BlogInputModel): Promise<BlogViewModel> => {
        const entity = {
            id: String(+new Date()),
            createdAt: new Date().toISOString(),
            isMembership: false,
            ...body,
        }
        const resp = await blogsRepository.create(entity);
        return getMongoViewModel(resp);
    }

    public update = async (id: string, body: BlogInputModel): Promise<boolean> => {
       return await blogsRepository.update(id, body);
    }

    public remove = async (id: string): Promise<boolean> => {
       return await blogsRepository.remove(id);
    }

    public clearDB = async () => {
       return await blogsRepository.clearDB();
    }

}

const blogsService = new BlogsService();

export {
    blogsService
}