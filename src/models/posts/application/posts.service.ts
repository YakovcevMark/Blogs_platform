import {postsRepository} from "../repositories/db-repository";
import {PostInputModel} from "../types/post.input.model";
import {BlogViewModel} from "../../blogs/types/blog.view.model";

class PostsService {

    public create = async (body: PostInputModel, blog: BlogViewModel): Promise<string> => {
        const entity = {
            id: String(+new Date()),
            blogName: blog!.name,
            createdAt: new Date().toISOString(),
            ...body,
        }
        return await postsRepository.create(entity);
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