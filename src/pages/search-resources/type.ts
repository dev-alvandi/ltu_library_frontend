interface FILTERS_TYPE {
    languages: Record<string, number>,
    categories: Record<string, number>,
    minYear: number;
    maxYear: number;
    availabilities: ("Available to Borrow" | "Reserved Only")[];
}

type RESOURCE_TYPES = "Books" | "Films" | "Magazines" | ""


type PARAMS_FILTER_VALUE =
    | string
    | number
    | string[]
    | Record<string, number>
    | null
    | undefined;

export type {
    FILTERS_TYPE,
    RESOURCE_TYPES,
    PARAMS_FILTER_VALUE
}