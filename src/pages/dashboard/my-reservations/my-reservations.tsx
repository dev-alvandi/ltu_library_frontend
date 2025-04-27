// MyReservations.tsx
import { useState } from "react";
import TableReservation from "@/pages/dashboard/my-reservations/table-reservation.tsx";
import PaginationControls from "@/pages/dashboard/my-reservations/pagination-controls.tsx";

const dummyReservations = Array.from({ length: 15 }).map((_, index) => ({
    id: index,
    imageUrl:
        "https://www.cats.org.uk/media/13136/220325case013.jpg?width=500&height=333.49609375",
    title: `Reserved Book ${index + 1}`,
    reservedAt: new Date(Date.now() - index * 86400000),
    queuePosition: index + 1,
}));

const MyReservations = () => {
    const itemsPerPage = 5;
    const [page, setPage] = useState(1);
    const [reservations, setReservations] = useState(dummyReservations);

    const paginatedReservations = reservations.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );
    const pageCount = Math.ceil(reservations.length / itemsPerPage);

    const handleRemove = (id: number) => {
        setReservations((prev) => prev.filter((r) => r.id !== id));
    };

    return (
        <div className="w-full px-4 py-8">
            <div className="bg-[#1e1e24] rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-[#2c2c2f]">
                    <h2 className="text-xl font-semibold text-white">My Reservations</h2>
                </div>
                <TableReservation
                    reservations={paginatedReservations}
                    onRemove={handleRemove}
                />
                <PaginationControls page={page} setPage={setPage} pageCount={pageCount} />
            </div>
        </div>
    );
};

export default MyReservations;
