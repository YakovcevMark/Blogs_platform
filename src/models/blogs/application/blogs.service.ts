import {BlogsRepository} from "../repositories/db-repository";
import {BlogInputModel} from "../types/blog.input.model";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsService {
    constructor(@inject(BlogsRepository) protected blogsRepository: BlogsRepository) {
    }

    public create = async (body: BlogInputModel): Promise<string> => {
        const entity = {
            id: String(+new Date()),
            createdAt: new Date().toISOString(),
            isMembership: false,
            ...body,
        }
        return await this.blogsRepository.create(entity);
    }

    public update = async (id: string, body: BlogInputModel): Promise<boolean> => {
        return await this.blogsRepository.update(id, body);
    }

    public remove = async (id: string): Promise<boolean> => {
        return await this.blogsRepository.remove(id);
    }

}

