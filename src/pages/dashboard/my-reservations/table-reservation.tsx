// TableReservation.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import TableAction from "./table-action";
import {ReservationResponse} from "@/store/user-slice.ts";

export interface Reservation {
    id: number;
    imageUrl: string;
    title: string;
    reservedAt: Date;
    queuePosition: number;
}

interface TableReservationProps {
    reservations: ReservationResponse[];
    onRemove: (id: string) => void;
    onBorrow: (id: string) => void;
}

const TableReservation = ({ reservations, onRemove, onBorrow }: TableReservationProps) => {
    return (
        <Table className="text-sm">
            <TableHeader>
                <TableRow className="bg-[#2c2c2f] text-white text-center">
                    <TableHead className="text-white text-center">Image</TableHead>
                    <TableHead className="text-white text-center">Title</TableHead>
                    <TableHead className="text-white text-center">Reserved at</TableHead>
                    <TableHead className="text-white text-center">Queue Position</TableHead>
                    <TableHead className="text-white text-center">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {reservations.map((reservation) => (
                    <TableRow
                        key={reservation.reservationId}
                        className="hover:bg-[#2e2e35] transition border-b border-[#2a2a2a] text-center"
                    >
                        <TableCell>
                            <img
                                src={reservation.imageUrl}
                                alt={reservation.title}
                                className="w-10 h-14 object-cover mx-auto rounded shadow-sm"
                            />
                        </TableCell>
                        <TableCell className="font-medium whitespace-normal max-w-40 text-white text-left">{reservation.title}</TableCell>
                        <TableCell className="text-gray-300">
                            {format(reservation.reservedAt, "MMMM do, yyyy")}
                        </TableCell>
                        <TableCell>
                            <Badge variant="secondary" className="bg-(--color-blue-theme) text-white">
                                {reservation.queuePosition}
                            </Badge>
                        </TableCell>
                        {
                            reservation.queuePosition > 0 ? (
                                <TableCell>
                                    <TableAction id={reservation.reservationId} title={reservation.title} type="REMOVE"
                                                 handleAction={onRemove}/>
                                </TableCell>
                            ) : (
                                <TableCell>
                                    <TableAction id={reservation.reservationId} title={reservation.title} type="BORROW"
                                                 handleAction={onBorrow}/>
                                </TableCell>
                                )
                        }
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default TableReservation;
