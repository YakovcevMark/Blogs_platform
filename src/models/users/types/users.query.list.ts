import {SorterInput} from "../../../core/types/sorter.input";
import {PaginatorInput} from "../../../core/types/paginator.input";

export type UsersQueryList = PaginatorInput & SorterInput & {
    searchLoginTerm?: string;
    searchEmailTerm?: string;
}