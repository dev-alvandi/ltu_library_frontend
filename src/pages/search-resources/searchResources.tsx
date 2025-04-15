import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import FilterGrid from "@/pages/search-resources/filterGrid";
import SearchGrid from "@/pages/search-resources/searchGrid";
import ResourceGrid from "@/pages/search-resources/resourceGrid";
import {FILTERS_TYPE, PARAMS_FILTER_VALUE} from "@/pages/search-resources/type";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/store/store.ts";
import { allBooksFilters, filteredBooks, getAllBooks } from "@/store/bookSlice.ts";
import Loading from "@/components/loading/loading.tsx";
import { useParsedSearchParams } from "@/hooks/use-parsedSearch-params.tsx";
import {normalizeFiltersFromParams} from "@/utils/normalizeFilters.ts";

const defaultFilters: FILTERS_TYPE = {
    categories: {},
    languages: {},
    minYear: 1000,
    maxYear: new Date().getFullYear(),
    availabilities: ["Available to Borrow", "Reserved Only"],
};

// Utility: check if any filters are actively used
const hasActiveFilters = (filters: Record<string, PARAMS_FILTER_VALUE>): boolean => {
    return Object.values(filters).some((value) => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === "object" && value !== null) return Object.keys(value).length > 0;
        return value !== "" && value !== null && value !== undefined;
    });
};

const SearchResources = ({ resource }: { resource: string }) => {
    const dispatch = useAppDispatch();

    const {
        categories,
        languages,
        minPublishedYear,
        maxPublishedYear,
        results,
        status
    } = useAppSelector(state => state.book);

    const [searchParams, setSearchParams] = useSearchParams();
    const filters = useParsedSearchParams([
        "query",
        "availabilities",
        "languages",
        "categories",
        "minYear",
        "maxYear"
    ]);

    const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)]);

    // console.log(memoizedFilters)

    const [userFilters, setUserFilters] = useState<FILTERS_TYPE>(defaultFilters);
    const [searchTerm, setSearchTerm] = useState("");

    // Keep search term in sync with URL
    useEffect(() => {
        const queryParam = searchParams.get("query") || "";
        setSearchTerm(prev => (prev !== queryParam ? queryParam : prev));
    }, [searchParams]);

    // Fetch all filters + either all books or filtered books
    useEffect(() => {
        dispatch(allBooksFilters());

        if (hasActiveFilters(memoizedFilters)) {
            const normalized = normalizeFiltersFromParams(memoizedFilters);
            dispatch(filteredBooks(normalized));
        } else {
            dispatch(getAllBooks());
        }
    }, [dispatch, memoizedFilters]);

    // Build memoized global filter object for UI options
    const allFilters = useMemo<FILTERS_TYPE>(() => ({
        categories,
        languages,
        minYear: minPublishedYear,
        maxYear: maxPublishedYear,
        availabilities: ["Available to Borrow", "Reserved Only"]
    }), [categories, languages, minPublishedYear, maxPublishedYear]);

    const handleSearch = (query: string) => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            if (query) {
                params.set("query", query);
            } else {
                params.delete("query");
            }
            return params;
        });
    };
    //
    // if (status === "loading") {
    //     return <Loading />;
    // }

    return (
        <div className="grid grid-cols-12 h-[calc(100vh-5rem)] pt-4">
            {/* Filter Sidebar */}
            <div className="col-span-3">
                <div className="sticky top-20 h-[calc(100vh-5rem-1rem)] overflow-auto pr-2">
                    <FilterGrid
                        userFilters={userFilters}
                        allFilters={allFilters}
                        setUserFilters={setUserFilters}
                        resourceName={resource}
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="col-span-9">
                <SearchGrid onSearch={handleSearch} searchTerm={searchTerm} />
                <Separator />
                <ResourceGrid resourceName={resource} results={results} />
            </div>
        </div>
    );
};

export default SearchResources;
