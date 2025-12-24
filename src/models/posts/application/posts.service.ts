import {PostInputModel} from "../types/post.input.model";
import {BlogViewModel} from "../../blogs/types/blog.view.model";
import {inject, injectable} from "inversify";
import {PostsRepository} from "../repositories/db-repository";

@injectable()
export class PostsService {
    constructor(@inject(PostsRepository)protected postsRepository:PostsRepository) {
    }
    public create = async (body: PostInputModel, blog: BlogViewModel): Promise<string> => {
        const entity = {
            id: String(+new Date()),
            blogName: blog!.name,
            createdAt: new Date().toISOString(),
            ...body,
        }
        return await this.postsRepository.create(entity);
    }

    public update = async (id: string, body: PostInputModel): Promise<boolean> => {
        return await this.postsRepository.update(id, body);
    }

    public remove = async (id: string): Promise<boolean> => {
        return await this.postsRepository.remove(id);
    }

}

