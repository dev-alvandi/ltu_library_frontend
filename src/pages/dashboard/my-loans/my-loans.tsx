import { useEffect, useState } from "react";
import TableLoan from "@/pages/dashboard/my-loans/table-loan.tsx";
import PaginationControls from "@/pages/dashboard/my-loans/pagination-controls.tsx";
import { extendResource, getLoanItems } from "@/store/user-slice.ts";
import { useAppDispatch, useAppSelector } from "@/store/store.ts";
import { toast } from "react-toastify";

const MyLoans = () => {
    const dispatch = useAppDispatch();
    const { content, totalPages } = useAppSelector(state => state.user.loans);
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(getLoanItems(page - 1));
    }, [page]);

    const handleConfirmAction = async (id: string, isOverdue: boolean) => {
        if (isOverdue) {
            console.log(`Paid fine for loan ID: ${id}`);
        } else {
            const result = await dispatch(extendResource(id));

            if (extendResource.fulfilled.match(result)) {
                toast.success("Resource extended");
                await dispatch(getLoanItems(page - 1)); // Refresh table
            } else {
                toast.error("An error occurred while extending the resource");
            }

            console.log(`Extended loan ID: ${id}`);
        }
    };

    return (
        <div className="w-full px-4 py-8">
            <div className="bg-[#1e1e24] rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-[#2c2c2f]">
                    <h2 className="text-xl font-semibold text-white">My Loans</h2>
                </div>
                <TableLoan loans={content} onTableAction={handleConfirmAction} />
                <PaginationControls page={page} pageCount={totalPages} onPageChange={setPage} />
            </div>
        </div>
    );
};

export default MyLoans;
