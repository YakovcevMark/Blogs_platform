type Filter<T> = {
    fieldName: keyof T;
    queryParam?: string;
    isStrictEqual?: boolean
}
export const getDbFilters = <T>(filters: Filter<T>[]) => {

    const output: Record<string, { $regex: string, $options: string } | string> = {}

    for (const filter of filters) {

        const {fieldName, queryParam, isStrictEqual = false} = filter

        if (queryParam) {
            let filterParam

            if (isStrictEqual) {
                filterParam = queryParam

            } else {

                filterParam = {
                    $regex: queryParam,
                    $options: 'i'
                }

            }

            output[fieldName as string] = filterParam
        }
    }

    return output;
}