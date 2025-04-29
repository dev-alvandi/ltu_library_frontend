import {useEffect, useState} from "react";
import TableLoan from "@/pages/dashboard/my-loans/table-loan.tsx";
import PaginationControls from "@/pages/dashboard/my-loans/pagination-controls.tsx";
import {getLoanItems} from "@/store/userSlice.ts";
import {useAppDispatch, useAppSelector} from "@/store/store.ts";

const MyLoans = () => {

    const dispatch = useAppDispatch();
    const {content, totalPages} = useAppSelector(state => state.user.loans);

    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(getLoanItems(page - 1));
    }, [page]);

    return (
        <div className="w-full px-4 py-8">
            <div className="bg-[#1e1e24] rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-[#2c2c2f]">
                    <h2 className="text-xl font-semibold text-white">My Loans</h2>
                </div>
                <TableLoan loans={content} />
                <PaginationControls page={page} pageCount={totalPages} onPageChange={setPage} />
            </div>
        </div>
    );
};

export default MyLoans;
