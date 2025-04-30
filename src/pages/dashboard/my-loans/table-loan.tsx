import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import TableAction from "./table-action";
import {LoanItemResponse} from "@/store/userSlice.ts";

interface TableLoanProps {
    loans: LoanItemResponse[];
}

const TableLoan = ({ loans }: TableLoanProps) => {
    console.log(loans)
    return (
        <Table className="text-sm">
            <TableHeader>
                <TableRow className="bg-[#2c2c2f] text-white text-center">
                    <TableHead className="text-white text-center">Image</TableHead>
                    <TableHead className="text-white text-center">Title</TableHead>
                    <TableHead className="text-white text-center">Borrowed At</TableHead>
                    <TableHead className="text-white text-center">Due Date</TableHead>
                    <TableHead className="text-white text-center">Status</TableHead>
                    <TableHead className="text-white text-center">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loans.map((loan) => (
                    <TableRow
                        key={loan.loanId}
                        className="hover:bg-[#2e2e35] transition border-b border-[#2a2a2a] text-center"
                    >
                        <TableCell className="py-3">
                            <img
                                src={loan.imageUrl}
                                alt={loan.title}
                                className="w-10 h-14 object-cover mx-auto rounded shadow-sm"
                            />
                        </TableCell>
                        <TableCell className="font-medium text-white">{loan.title}</TableCell>
                        <TableCell className="text-gray-300">
                            {format(loan.borrowedAt, "MMMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-gray-300">
                            {format(loan.dueAt, "MMMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                            <Badge
                                className={
                                    loan.status === "RETURNED"
                                        ? "bg-green-500 text-white"
                                        : loan.status === "OVERDUE"
                                            ? "bg-red-500 text-white"
                                            : "bg-yellow-500 text-black"
                                }
                            >
                                {loan.status === "RETURNED"
                                    ? "Returned"
                                    : loan.status === "OVERDUE"
                                        ? "Overdue"
                                        : "Not Returned"}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <TableAction id={loan.loanId} title={loan.title} status={loan.status} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default TableLoan;