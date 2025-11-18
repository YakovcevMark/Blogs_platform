import {PaginatorInput} from "../types/paginator.input";

export const getPagesCount = (props: Pick<PaginatorInput, 'pageSize'> & {
    totalCount: number
}) => Math.ceil(props.totalCount / props.pageSize);