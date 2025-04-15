import { FILTERS_TYPE } from "@/pages/search-resources/type";

export const normalizeFiltersFromParams = (filters: Record<string, any>): FILTERS_TYPE => {
    const toRecord = (input: string | string[] | undefined): Record<string, number> => {
        if (!input) return {};
        if (Array.isArray(input)) {
            return Object.fromEntries(input.map((item) => [item, 1]));
        }
        return Object.fromEntries(input.split(",").map((item) => [item.trim(), 1]));
    };

    const toAvailabilities = (input: string | string[] | undefined): FILTERS_TYPE["availabilities"] => {
        const validOptions: FILTERS_TYPE["availabilities"] = ["Available to Borrow", "Reserved Only"];
        const items = Array.isArray(input) ? input : input?.split(",") ?? [];
        return items.filter((a): a is FILTERS_TYPE["availabilities"][number] => validOptions.includes(a));
    };

    return {
        availabilities: toAvailabilities(filters.availabilities),
        categories: toRecord(filters.categories),
        languages: toRecord(filters.languages),
        minYear: filters.minYear ? parseInt(filters.minYear, 10) || 1000 : 1000,
        maxYear: filters.maxYear ? parseInt(filters.maxYear, 10) || new Date().getFullYear() : new Date().getFullYear(),
    };
};
