import {PaginatorOutput} from "../../../core/types/paginator.output";
import {getMongoViewModel} from "../../../core/utils/get-view-model";
import {getPagesCount} from "../../../core/utils/get-pages-count";
import {postsRepository} from "../repositories/db-repository";
import {PostViewModel} from "../types/post.view.model";
import {PostInputModel} from "../types/post.input.model";
import {blogsService} from "../../blogs/application/blogs.service";
import {PostsQueryList} from "../types/posts.query.list";

class PostsService {

    public getAll = async (params: PostsQueryList): Promise<PaginatorOutput<PostViewModel>> => {
        const {pageSize, pageNumber} = params;
        const items = await postsRepository.getAll(params)
        const totalCount = await postsRepository.getCount(params);

        return {
            pageSize,
            items: items.map(getMongoViewModel),
            page: pageNumber,
            pagesCount: getPagesCount({pageSize, totalCount}),
            totalCount
        }

    }

    public getById = async (id: string): Promise<PostViewModel | null> => {
        const entity = await postsRepository.getById(id);
        if (!entity) {
            return null
        } else {
            return getMongoViewModel(entity);
        }
    }

    public create = async (body: PostInputModel): Promise<PostViewModel> => {
        const blog = await blogsService.getById(body.blogId)
        const entity = {
            id: String(+new Date()),
            blogName: blog!.name,
            createdAt: new Date().toISOString(),
            ...body,
        }
        const resp = await postsRepository.create(entity);
        return getMongoViewModel(resp);
    }

    public update = async (id: string, body: PostInputModel): Promise<boolean> => {
        return await postsRepository.update(id, body);
    }

    public remove = async (id: string): Promise<boolean> => {
        return await postsRepository.remove(id);
    }

    public clearDB = async () => {
        return await postsRepository.clearDB();
    }

}

const postsService = new PostsService();

export {
    postsService
}