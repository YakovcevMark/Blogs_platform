import {BlogViewModel} from "../types/blog.view.model";
import {BlogInputModel} from "../types/blog.input.model";
import {blogsCollection} from "../../../db-settings";
import {ObjectId, WithId} from "mongodb";
import {BlogsQueryList} from "../types/blogs.query.list";
import {getSortDbDirection} from "../../../core/utils/get-sort-db-direction";
import {getSkipDbValue} from "../../../core/utils/get-skip-db-value";
import {getDbFilters} from "../../../core/utils/get-db-filters";


class BlogsRepository {

    public getAll = async (params: BlogsQueryList): Promise<WithId<BlogViewModel>[]> => {
        const {searchNameTerm, sortBy, sortDirection, pageSize, pageNumber} = params;

        return await blogsCollection
            .find(getDbFilters<BlogViewModel>([{fieldName: 'name', queryParam: searchNameTerm}]))
            .sort(sortBy, getSortDbDirection(sortDirection))
            .skip(getSkipDbValue({pageSize, pageNumber}))
            .limit(pageSize)
            .toArray()
    }

    public getCount = async (params: Partial<Pick<BlogsQueryList, 'searchNameTerm'>>): Promise<number> => {
        const {searchNameTerm} = params;
        return await blogsCollection.countDocuments(getDbFilters<BlogViewModel>([{fieldName: 'name', queryParam: searchNameTerm}]));
    }

    public isPersistInDb = async (id: string): Promise<boolean> => {
        const blogsList = await blogsCollection.find({id}).toArray();
        return blogsList.length > 0;
    }

    public getById = async (id: string): Promise<WithId<BlogViewModel> | null> => {
        return await blogsCollection.findOne({_id: new ObjectId(id)})
    }

    public create = async (entity: BlogViewModel): Promise<WithId<BlogViewModel>> => {
        const result = await blogsCollection.insertOne(entity);
        return {...entity, _id: result.insertedId};
    }

    public update = async (id: string, body: BlogInputModel): Promise<boolean> => {
        const resp = await blogsCollection.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    ...body
                },
            }
        );
        return resp.modifiedCount > 0;
    }

    public remove = async (id: string): Promise<boolean> => {
        const response = await blogsCollection.deleteOne({_id: new ObjectId(id)});
        return response.deletedCount > 0
    }

    public clearDB = async () => {
        await blogsCollection.deleteMany()
    }

}


const blogsRepository = new BlogsRepository();

export {
    blogsRepository,
};