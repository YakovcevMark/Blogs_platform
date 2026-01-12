import {ObjectId} from "mongodb";

export const getFilterByIds = (ids: string[]) => {
    return {'_id': {$in: ids.map(id => new ObjectId(id))}};
}