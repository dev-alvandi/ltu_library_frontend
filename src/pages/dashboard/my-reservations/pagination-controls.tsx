// PaginationControls.tsx
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";

interface PaginationControlsProps {
    page: number;
    pageCount: number;
    setPage: (page: number) => void;
}

const PaginationControls = ({ page, pageCount, setPage }: PaginationControlsProps) => {
    return (
        <div className="flex justify-end px-6 py-4 border-t border-[#2c2c2f]">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => setPage(Math.max(1, page - 1))}
                        />
                    </PaginationItem>
                    <PaginationItem className="text-white">
                        {page} / {pageCount}
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => setPage(Math.min(pageCount, page + 1))}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default PaginationControls;
