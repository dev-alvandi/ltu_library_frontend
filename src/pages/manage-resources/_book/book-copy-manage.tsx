import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {RootState, useAppSelector} from "@/store/store";
import {createBookCopy, fetchBookCopiesByBookId} from "@/store/bookCopySlice";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter} from "@/components/ui/dialog";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@/components/ui/select";
import {Table, TableHead, TableHeader, TableRow, TableBody, TableCell} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext
} from "@/components/ui/pagination";
import {Badge} from "@/components/ui/badge";

interface SelectedCopy {
    id: string;
    type: string;
    location: string;
    status: string;
}

const BookCopyManage = ({bookId}: { bookId: string }) => {
    const dispatch = useDispatch();
    const {copies, status} = useAppSelector((state: RootState) => state.bookCopy);

    const [currentPage, setCurrentPage] = useState(0);

    const [openAddNewCopyDialog, setOpenAddNewCopyDialog] = useState(false);
    const [openManageCopyDialog, setOpenManageCopyDialog] = useState(false);

    const [selectedCopy, setSelectedCopy] = useState<SelectedCopy | null>(null);

    const [bookCopyStatus, setBookCopyStatus] = useState<string>("");
    const [bookCopyType, setBookCopyType] = useState<string>("");
    const [bookCopyLocation, setBookCopyLocation] = useState<string>("");

    useEffect(() => {
        if (bookId) {
            dispatch(fetchBookCopiesByBookId({bookId, page: currentPage}) as any);
        }
    }, [dispatch, bookId, currentPage]);

    const handlePagination = (page: number) => {
        setCurrentPage(page);
    };

    const handleCreateCopy = async () => {
        try {
            await dispatch(
                createBookCopy({
                    bookId,
                    physicalLocation: bookCopyLocation,
                    itemReferenceCopy: bookCopyType === "REFERENCE"
                }) as any
            );

            await dispatch(fetchBookCopiesByBookId({bookId, page: currentPage}) as any);
            setOpenAddNewCopyDialog(false);
            setBookCopyLocation("");
        } catch (error) {
            console.error("Failed to create book copy:", error);
        }
    };

    const handleOpenManageDialog = (copy: any) => {
        setSelectedCopy({
            id: copy.bookCopyId,
            type: copy.itemReferenceCopy ? "REFERENCE" : "BORROWABLE",
            location: copy.physicalLocation,
            status: copy.status
        });
        setBookCopyType(copy.itemReferenceCopy ? "REFERENCE" : "BORROWABLE");
        setBookCopyLocation(copy.physicalLocation);
        setBookCopyStatus(copy.status)
        setOpenManageCopyDialog(true);
    };

    const handleUpdateCopy = async () => {
        console.log("Update Copy:", selectedCopy);
        setOpenManageCopyDialog(false);
    };

    const handleDeleteCopy = async () => {
        console.log("Delete Copy:", selectedCopy);
        setOpenManageCopyDialog(false);
    };

    if (status === "loading") return <p>Loading...</p>;
    if (status === "failed") return <p>Failed to load copies.</p>;

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg pt-4 flex items-center justify-between">
                All Copies
                <Dialog open={openAddNewCopyDialog} onOpenChange={setOpenAddNewCopyDialog}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Add New Copy</Button>
                    </DialogTrigger>

                    <DialogContent className="bg-[#030712] text-white border border-[#2a2a2a] rounded-lg">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-semibold text-white">Add New Book Copy</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 mt-4">
                            <div className="space-y-3 flex flex-col">
                                <label className="text-sm font-medium my-2">Type</label>
                                <Select onValueChange={setBookCopyType}>
                                    <SelectTrigger
                                        className="bg-[#2c2c2f] text-white border border-[#3a3a3f] cursor-pointer">
                                        <SelectValue placeholder="Select type..."/>
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#2c2c2f] text-white border border-[#3a3a3f]">
                                        <SelectItem value="REFERENCE">Reference</SelectItem>
                                        <SelectItem value="BORROWABLE">Borrowable</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3 flex flex-col">
                                <label className="text-sm font-medium my-2">Location</label>
                                <Input
                                    value={bookCopyLocation}
                                    onChange={(e) => setBookCopyLocation(e.target.value)}
                                    placeholder="Enter location"
                                    className="bg-[#2c2c2f] text-white border border-[#3a3a3f]"
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-4 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setOpenAddNewCopyDialog(false)}
                                    className="bg-[#2c2c2f] text-white border-[#3a3a3f] hover:bg-[#3a3a3f]">
                                Cancel
                            </Button>
                            <Button onClick={handleCreateCopy} className="bg-blue-600 hover:bg-blue-700">
                                Create
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </h3>

            <Table className="text-sm">
                <TableHeader>
                    <TableRow className="bg-[#2c2c2f] text-white text-center">
                        <TableHead className="text-white text-center">Barcode</TableHead>
                        <TableHead className="text-white text-center">ID</TableHead>
                        <TableHead className="text-white text-center">Status</TableHead>
                        <TableHead className="text-white text-center">Location</TableHead>
                        <TableHead className="text-white text-center">Type</TableHead>
                        <TableHead className="text-white text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {copies.content.map((copy) => (
                        <TableRow
                            key={copy.bookCopyId}
                            className="hover:bg-[#2e2e35] transition border-b border-[#2a2a2a] text-center"
                        >
                            <TableCell className="py-3">
                                <a href={copy.barcodeUrl} download={`${copy.barcodeId}.png`}>
                                    <img
                                        src={copy.barcodeUrl}
                                        alt={copy.barcodeId}
                                        className="w-10 h-14 object-cover mx-auto rounded shadow-sm cursor-pointer"
                                    />
                                </a>
                            </TableCell>
                            <TableCell className="font-medium text-white">
                                {copy.bookCopyId}
                            </TableCell>
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
                            <TableCell className="text-gray-300">
                                {copy.physicalLocation}
                            </TableCell>
                            <TableCell>
                                {copy.itemReferenceCopy ? (
                                    <Badge className="bg-blue-700 text-white">Reference</Badge>
                                ) : (
                                    <Badge className="bg-green-700 text-white">Borrowable</Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700"
                                        onClick={() => handleOpenManageDialog(copy)}>
                                    Manage
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => handlePagination(Math.max(currentPage - 1, 0))}
                            className="cursor-pointer"
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <span className="px-2">Page {copies.number + 1} of {copies.totalPages}</span>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => handlePagination(Math.min(currentPage + 1, copies.totalPages - 1))}
                            className="cursor-pointer"
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

            {/* Manage Copy Dialog */}
            <Dialog open={openManageCopyDialog} onOpenChange={setOpenManageCopyDialog}>
                <DialogContent className="bg-[#030712] text-white border border-[#2a2a2a] rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-white">
                            Manage Book Copy
                        </DialogTitle>
                    </DialogHeader>

                    {selectedCopy && (
                        <div className="space-y-4 mt-4">

                            {
                                (selectedCopy.status === "AVAILABLE" || selectedCopy.status === "LOST") && (
                                    <div className="space-y-3 flex flex-col">
                                        <label className="text-sm font-medium my-2">Type</label>
                                        <Select value={bookCopyStatus} onValueChange={setBookCopyStatus}>
                                            <SelectTrigger
                                                className="bg-[#2c2c2f] text-white border border-[#3a3a3f] cursor-pointer">
                                                <SelectValue placeholder="Select type..."/>
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#2c2c2f] text-white border border-[#3a3a3f]">
                                                <SelectItem value="AVAILABLE">AVAILABLE</SelectItem>
                                                <SelectItem value="LOST">LOST</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )
                            }


                            <div className="space-y-3 flex flex-col">
                                <label className="text-sm font-medium my-2">Type</label>
                                <Select value={bookCopyType} onValueChange={setBookCopyType}>
                                    <SelectTrigger
                                        className="bg-[#2c2c2f] text-white border border-[#3a3a3f] cursor-pointer">
                                        <SelectValue placeholder="Select type..."/>
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#2c2c2f] text-white border border-[#3a3a3f]">
                                        <SelectItem value="REFERENCE">Reference</SelectItem>
                                        <SelectItem value="BORROWABLE">Borrowable</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3 flex flex-col">
                                <label className="text-sm font-medium my-2">Location</label>
                                <Input
                                    value={bookCopyLocation}
                                    onChange={(e) => setBookCopyLocation(e.target.value)}
                                    placeholder="Enter location"
                                    className="bg-[#2c2c2f] text-white border border-[#3a3a3f]"
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter className="pt-4 flex justify-end gap-2">
                        <Button
                            variant="destructive"
                            onClick={handleDeleteCopy}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setOpenManageCopyDialog(false)}
                            className="bg-[#2c2c2f] text-white hover:bg-[#3a3a3f]"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateCopy}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Update
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BookCopyManage;
