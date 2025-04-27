import { useState } from "react";
import { addDays } from "date-fns";
import TableLoan from "@/pages/dashboard/my-loans/table-loan.tsx";
import PaginationControls from "@/pages/dashboard/my-loans/pagination-controls.tsx";

const dummyLoans = Array.from({ length: 18 }).map((_, index) => {
    const borrowedAt = new Date(Date.now() - index * 86400000);
    const dueDate = addDays(borrowedAt, 14);
    let status: "RETURNED" | "NOT_RETURNED" | "OVERDUE" = "NOT_RETURNED";

    if (index % 3 === 0) {
        status = "RETURNED";
    } else if (dueDate < new Date()) {
        status = "OVERDUE";
    }

    return {
        id: index,
        imageUrl:
            "https://www.cats.org.uk/media/13136/220325case013.jpg?width=500&height=333.49609375",
        title: `Book Title ${index + 1}`,
        borrowedAt,
        dueDate,
        status,
    };
});

const MyLoans = () => {
    const itemsPerPage = 5;
    const [page, setPage] = useState(1);
    const pageCount = Math.ceil(dummyLoans.length / itemsPerPage);
    const paginatedLoans = dummyLoans.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="w-full px-4 py-8">
            <div className="bg-[#1e1e24] rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-[#2c2c2f]">
                    <h2 className="text-xl font-semibold text-white">My Loans</h2>
                </div>
                <TableLoan loans={paginatedLoans} />
                <PaginationControls page={page} pageCount={pageCount} onPageChange={setPage} />
            </div>
        </div>
    );
};

export default MyLoans;
