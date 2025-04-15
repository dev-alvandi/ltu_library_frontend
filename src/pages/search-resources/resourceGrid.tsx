import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import { PaginationBookResponse } from "@/store/bookSlice.ts";

interface Props {
    results: PaginationBookResponse | null;
    resourceName: string;
}

const ResourceGrid = ({ results, resourceName }: Props) => {
    const [currentPage, setCurrentPage] = useState(1);
    const maxVisiblePages = 5; // Display range: 2 before + current + 2 after

    const totalPages = results?.totalPages || 1;

    const paginatedResults = useMemo(() => {
        if (!results || results.content.length <= 0 || results.numberOfElements === 0) return;
        const start = (currentPage - 1) * results.numberOfElements;
        return results.content.slice(start, start + results.numberOfElements);
    }, [currentPage, results]);

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

    // console.log(results)

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
        <div className="space-y-4">
            {paginatedResults && paginatedResults.map((item, index) => (
                <Card key={index}>
                    <CardContent className="p-4 text-sm font-mono whitespace-pre-wrap">
                        {JSON.stringify(item, null, 2)}
                    </CardContent>
                </Card>
            ))}

            <Pagination>
                <PaginationContent>
                    {/* Previous Button */}
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>

                    {/* First page + ellipsis if needed */}
                    {currentPage > 3 && (
                        <>
                            <PaginationItem>
                                <PaginationLink onClick={() => handlePageChange(1)}>
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
                                <PaginationLink onClick={() => handlePageChange(totalPages)}>
                                    {totalPages}
                                </PaginationLink>
                            </PaginationItem>
                        </>
                    )}

                    {/* Next Button */}
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default ResourceGrid;
