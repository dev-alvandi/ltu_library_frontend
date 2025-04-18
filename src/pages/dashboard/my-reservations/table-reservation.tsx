// TableReservation.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import TableAction from "./table-action";

export interface Reservation {
    id: number;
    imageUrl: string;
    title: string;
    reservedAt: Date;
    queuePosition: number;
}

interface TableReservationProps {
    reservations: Reservation[];
    onRemove: (id: number) => void;
}

const TableReservation = ({ reservations, onRemove }: TableReservationProps) => {
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
                {reservations.map((res) => (
                    <TableRow
                        key={res.id}
                        className="hover:bg-[#2e2e35] transition border-b border-[#2a2a2a] text-center"
                    >
                        <TableCell>
                            <img
                                src={res.imageUrl}
                                alt={res.title}
                                className="w-10 h-14 object-cover mx-auto rounded shadow-sm"
                            />
                        </TableCell>
                        <TableCell className="font-medium text-white">{res.title}</TableCell>
                        <TableCell className="text-gray-300">
                            {format(res.reservedAt, "MMMM do, yyyy")}
                        </TableCell>
                        <TableCell>
                            <Badge variant="secondary" className="bg-(--color-blue-theme) text-white">
                                {res.queuePosition}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <TableAction id={res.id} title={res.title} onRemove={onRemove} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default TableReservation;
