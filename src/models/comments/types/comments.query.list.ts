import {SorterInput} from "../../../core/types/sorter.input";
import {PaginatorInput} from "../../../core/types/paginator.input";

export type CommentsQueryList = PaginatorInput & SorterInput & {
    postId?: string;
};