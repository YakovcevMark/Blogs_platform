import {PaginatorInput} from "../types/paginator.input";

export const getSkipDbValue = (props: PaginatorInput) => (props.pageNumber - 1) * props.pageSize;