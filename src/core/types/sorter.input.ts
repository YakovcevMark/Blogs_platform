import {SORT_DIRECTIONS} from "../enums/sort-directions";
import {DEFAULT_SORT_VALUE} from "../constants/sorting";

export type SorterInput<T = typeof DEFAULT_SORT_VALUE> = {
    sortBy: T
    sortDirection: SORT_DIRECTIONS
}