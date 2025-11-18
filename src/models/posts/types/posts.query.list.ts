import {PaginatorInput} from "../../../core/types/paginator.input";
import {SorterInput} from "../../../core/types/sorter.input";

export type PostsQueryList = PaginatorInput & SorterInput & {blogId?: string};