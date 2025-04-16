export const booksParamsSerializer = (params: Record<string, string>): string => {
    const searchParams = new URLSearchParams();

    const categoryKeys = Object.keys(params.categories || {});
    if (categoryKeys.length > 0) {
        searchParams.append("categories", categoryKeys.join(","));
    }

    const languageKeys = Object.keys(params.languages || {});
    if (languageKeys.length > 0) {
        searchParams.append("languages", languageKeys.join(","));
    }

    searchParams.append("minYear", String(params.minYear));
    searchParams.append("maxYear", String(params.maxYear));
    searchParams.append("isAvailable", String(params.isAvailable));

    if (params.page !== undefined) {
        searchParams.append("page", String(params.page));
    }

    if (params.query !== undefined) {
        searchParams.append("query", String(params.query));
    }

    return searchParams.toString();
};
