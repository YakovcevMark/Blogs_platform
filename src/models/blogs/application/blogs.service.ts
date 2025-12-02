import {blogsRepository} from "../repositories/db-repository";
import {BlogInputModel} from "../types/blog.input.model";

class BlogsService {

    public create = async (body: BlogInputModel): Promise<string> => {
        const entity = {
            id: String(+new Date()),
            createdAt: new Date().toISOString(),
            isMembership: false,
            ...body,
        }
        return await blogsRepository.create(entity);
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