import {SORT_DIRECTIONS} from "../enums/sort-directions";

export const getSortDbDirection = (sortDirection: SORT_DIRECTIONS) => sortDirection === 'asc' ? 1 : -1