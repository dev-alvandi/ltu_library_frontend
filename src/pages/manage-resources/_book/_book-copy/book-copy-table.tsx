import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const BookCopyTable = ({ copies, onManage }: { copies: any[], onManage: (copy: any) => void }) => {
    return (
        <Table className="text-sm">
            <TableHeader>
                <TableRow className="bg-[#2c2c2f] text-white text-center">
                    <TableHead className="text-center font-bold text-white">Barcode</TableHead>
                    <TableHead className="text-center font-bold text-white">ID</TableHead>
                    <TableHead className="text-center font-bold text-white">Status</TableHead>
                    <TableHead className="text-center font-bold text-white">Location</TableHead>
                    <TableHead className="text-center font-bold text-white">Type</TableHead>
                    <TableHead className="text-center font-bold text-white">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {copies.map((copy) => (
                    <TableRow key={copy.bookCopyId} className="hover:bg-[#2e2e35] transition border-b border-[#2a2a2a] text-center">
                        <TableCell className="py-3">
                            <a href={copy.barcodeUrl} download={`${copy.barcodeId}.png`}>
                                <img
                                    src={copy.barcodeUrl}
                                    alt={copy.barcodeId}
                                    className="w-10 h-14 object-cover mx-auto rounded shadow-sm cursor-pointer"
                                />
                            </a>
                        </TableCell>
                        <TableCell className="font-medium text-white">{copy.bookCopyId}</TableCell>
                        <TableCell>
                            <Badge
                                className={
                                    copy.status === "AVAILABLE"
                                        ? "bg-green-700 text-white"
                                        : copy.status === "BORROWED"
                                            ? "bg-yellow-700 text-black"
                                            : "bg-red-700 text-white"
                                }
                            >
                                {copy.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">{copy.physicalLocation}</TableCell>
                        <TableCell>
                            {copy.itemReferenceCopy ? (
                                <Badge className="bg-blue-700 text-white">Reference</Badge>
                            ) : (
                                <Badge className="bg-green-700 text-white">Borrowable</Badge>
                            )}
                        </TableCell>
                        <TableCell>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => onManage(copy)}>
                                Manage
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default BookCopyTable;
