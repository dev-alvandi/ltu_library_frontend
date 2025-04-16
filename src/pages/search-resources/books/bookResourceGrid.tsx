import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.tsx";
import {PaginationBookResponse} from "@/store/bookSlice.ts";
import BookResource from "@/pages/search-resources/books/bookResource.tsx";

interface Props {
    results: PaginationBookResponse | null;
    resourceName: string;
    currentPage: number,
    setCurrentPage: (page: number) => void
}

const BookResourceGrid = ({results, resourceName, currentPage, setCurrentPage}: Props) => {
    const maxVisiblePages = 5; // Display range: 2 before + current + 2 after

    const totalPages = results?.totalPages || 1;


    const handlePageChange = (page: number) => {
        if (results && page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getPageRange = () => {
        const range: number[] = [];

        const half = Math.floor(maxVisiblePages / 2);
        let start = Math.max(1, currentPage - half);
        let end = Math.min(totalPages, currentPage + half);

        // Adjust range if close to start or end
        if (currentPage <= half) {
            end = Math.min(totalPages, maxVisiblePages);
        } else if (currentPage + half >= totalPages) {
            start = Math.max(1, totalPages - maxVisiblePages + 1);
        }

        for (let i = start; i <= end; i++) {
            range.push(i);
        }

        return range;
    };


    if (results && results?.content.length <= 0) {
        return (
            <div className="w-full py-12 flex justify-center">
                <p className="text-muted-foreground italic">
                    No {resourceName.toLowerCase()} found.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 py-4 p-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results?.content.map((item, index) => (
                    <BookResource key={index} book={item}/>
                ))}
            </div>

            <Pagination>
                <PaginationContent>
                    {/* Previous Button */}
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>

                    {/* First page + ellipsis if needed */}
                    {currentPage > 3 && (
                        <>
                            <PaginationItem>
                                <PaginationLink className="cursor-pointer" onClick={() => handlePageChange(1)}>
                                    1
                                </PaginationLink>
                            </PaginationItem>
                            {currentPage > 4 && <span className="px-2 text-muted-foreground">...</span>}
                        </>
                    )}

                    {/* Page window */}
                    {getPageRange().map((page) => (
                        <PaginationItem key={page}>
                            <PaginationLink
                                className="cursor-pointer"
                                onClick={() => handlePageChange(page)}
                                isActive={currentPage === page}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    {/* Last page + ellipsis if needed */}
                    {currentPage < totalPages - 2 && (
                        <>
                            {currentPage < totalPages - 3 && <span className="px-2 text-muted-foreground">...</span>}
                            <PaginationItem>
                                <PaginationLink className="cursor-pointer" onClick={() => handlePageChange(totalPages)}>
                                    {totalPages}
                                </PaginationLink>
                            </PaginationItem>
                        </>
                    )}

                    {/* Next Button */}
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default BookResourceGrid;
