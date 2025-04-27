import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface LoanPaginationProps {
    page: number;
    pageCount: number;
    onPageChange: (page: number) => void;
}

const PaginationControls = ({ page, pageCount, onPageChange }: LoanPaginationProps) => {
    return (
        <div className="flex justify-end px-6 py-4 border-t border-[#2c2c2f]">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious onClick={() => onPageChange(Math.max(1, page - 1))} />
                    </PaginationItem>
                    <PaginationItem className="text-white">
                        {page} / {pageCount}
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext onClick={() => onPageChange(Math.min(page + 1, pageCount))} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default PaginationControls;
