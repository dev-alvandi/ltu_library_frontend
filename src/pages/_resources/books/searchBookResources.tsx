import {useEffect, useMemo, useState} from "react";
import FilterBookGrid from "@/pages/_resources/books/filterBookGrid.tsx";
import SearchBookGrid from "@/pages/_resources/books/searchBookGrid.tsx";
import BookResourceGrid from "@/pages/_resources/books/bookResourceGrid.tsx";
import {FILTERS_TYPE} from "@/pages/_resources/books/type.ts";
import {useAppDispatch, useAppSelector} from "@/store/store.ts";
import {allBooksFilters, filteredBooks, getAllBooks, searchBooks} from "@/store/bookSlice.ts";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button.tsx";
import {SlidersHorizontal} from "lucide-react";

const defaultFilters: FILTERS_TYPE = {
    categories: {},
    languages: {},
    minYear: 1000,
    maxYear: new Date().getFullYear(),
    isAvailable: true,
    page: 1
};

// Utility: check if any filters are actively used
const hasActiveFilters = (filters: FILTERS_TYPE): boolean => {
    // Check if filters differ from defaults
    const isSame =
        filters.minYear === defaultFilters.minYear &&
        filters.maxYear === defaultFilters.maxYear &&
        filters.isAvailable &&
        Object.keys(filters.categories).length === 0 &&
        Object.keys(filters.languages).length === 0;

    return !isSame;
};

const SearchBookResources = ({resource}: { resource: string }) => {
    const dispatch = useAppDispatch();

    const {
        categories,
        languages,
        minPublishedYear,
        maxPublishedYear,
        results,
    } = useAppSelector(state => state.book);

    const userType = useAppSelector((state) => state.auth.user?.userType?.toUpperCase().trim());

    const [userFilters, setUserFilters] = useState<FILTERS_TYPE>(defaultFilters);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch all filters + either all books or filtered books
    useEffect(() => {
        dispatch(allBooksFilters());

        const pageIndex = currentPage - 1;

        if (searchTerm.trim()) {
            dispatch(searchBooks({ ...userFilters, query: searchTerm.trim(), page: pageIndex }));
        } else if (hasActiveFilters(userFilters)) {
            dispatch(filteredBooks({ ...userFilters, page: pageIndex }));
        } else {
            dispatch(getAllBooks(pageIndex));
        }
    }, [dispatch, searchTerm, userFilters, currentPage]);



    useEffect(() => {
        setCurrentPage(1); // reset pagination when filters change
    }, [userFilters]);

    // Build memoized global filter object for UI options
    const allFilters = useMemo<FILTERS_TYPE>(() => ({
        categories,
        languages,
        minYear: minPublishedYear,
        maxYear: maxPublishedYear,
        isAvailable: true
    }), [categories, languages, minPublishedYear, maxPublishedYear]);


    // if (status === "loading") {
    //     return <Loading />;
    // }

    return (
        <div className="grid grid-cols-12 h-[calc(100vh-5rem)] pt-4">
            {/* Filter Sidebar */}
                {/* Desktop Static Sidebar */}
                <div className="hidden lg:block col-span-3">
                    <div className="sticky top-20 h-[calc(100vh-6rem)] overflow-auto pr-2">
                        <FilterBookGrid
                            userFilters={userFilters}
                            allFilters={allFilters}
                            setUserFilters={setUserFilters}
                            resourceName={resource}
                        />
                    </div>
                </div>


            {/* Main Content Area */}
            <div className="col-span-12 px-6 md:col-span-12 md:px-12 lg:col-span-9 lg:px-0">
                <div className="sticky top-20 w-full flex justify-between items-center bg-[#030712] z-20 border border-transparent">
                    {/* Mobile Filter Button + Sheet */}
                    <div className="lg:hidden mb-4 px-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="secondary">
                                    <SlidersHorizontal />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-72 sm:w-80">
                                <SheetHeader>
                                    <SheetTitle>Filters</SheetTitle>
                                </SheetHeader>
                                <div className="mt-4">
                                    <FilterBookGrid
                                        userFilters={userFilters}
                                        allFilters={allFilters}
                                        setUserFilters={setUserFilters}
                                        resourceName={resource}
                                    />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                    <SearchBookGrid searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                </div>
                {/*<Separator />*/}
                <BookResourceGrid resourceName={resource} results={results} currentPage={currentPage}
                                  setCurrentPage={setCurrentPage} userType={userType || "STUDENT"}/>
            </div>
        </div>
    );
};

export default SearchBookResources;
