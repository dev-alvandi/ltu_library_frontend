// MyReservations.tsx
import {useEffect, useState} from "react";
import TableReservation from "@/pages/dashboard/my-reservations/table-reservation.tsx";
import PaginationControls from "@/pages/dashboard/my-reservations/pagination-controls.tsx";
import {useAppDispatch, useAppSelector} from "@/store/store.ts";
import {fetchUserReservations} from "@/store/userSlice.ts";


const MyReservations = () => {
    const dispatch = useAppDispatch()
    const {content, totalPages} = useAppSelector(state => state.user.reservations)

    const [page, setPage] = useState(1);

    const handleRemove = (id: string) => {
        console.log(id)
    }

    useEffect(() => {
        dispatch(fetchUserReservations(page - 1))
    }, [page]);

    return (
        <div className="w-full px-4 py-8">
            <div className="bg-[#1e1e24] rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-[#2c2c2f]">
                    <h2 className="text-xl font-semibold text-white">My Reservations</h2>
                </div>
                <TableReservation
                    reservations={content}
                    onRemove={handleRemove}
                />
                <PaginationControls page={page} setPage={setPage} pageCount={totalPages} />
            </div>
        </div>
    );
};

export default MyReservations;
