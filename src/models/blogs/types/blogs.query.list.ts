import {SorterInput} from "../../../core/types/sorter.input";
import {PaginatorInput} from "../../../core/types/paginator.input";

export type BlogsQueryList = PaginatorInput & SorterInput<'name'> & {
    searchNameTerm?: string;
}