type Filter<T> = {
    fieldName: keyof T;
    queryParam?: string;
}
export const getDbFilters = <T>(filters: Filter<T>[]) => {
    const output: Record<string, { $regex: string }> = {}
    for (const filter of filters) {
        const {fieldName, queryParam} = filter
        if (queryParam) {
            output[fieldName as string] = {
                $regex: queryParam.toLowerCase()
            }
        }
    }
    return output;
}