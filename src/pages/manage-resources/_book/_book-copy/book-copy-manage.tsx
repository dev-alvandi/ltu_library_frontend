import { useState, useEffect } from "react";
import {RootState, useAppDispatch, useAppSelector} from "@/store/store";
import {BookCopyRequest, deleteBookCopy, fetchBookCopiesByBookId, updateBookCopy} from "@/store/book-copy-slice.ts";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import AddNewCopyDialog from "@/pages/manage-resources/_book/_book-copy/add-new-copy-dialog.tsx";
import BookCopyTable from "@/pages/manage-resources/_book/_book-copy/book-copy-table.tsx";
import ManageCopyDialog from "@/pages/manage-resources/_book/_book-copy/manage-copy-dialog.tsx";
import {toast} from "react-toastify";
import {deepEqual} from "@/utils/deep-equal.ts";

const BookCopyManage = ({ bookId }: { bookId: string }) => {
    const dispatch = useAppDispatch();
    const { copies, status } = useAppSelector((state: RootState) => state.bookCopy);

    const [currentPage, setCurrentPage] = useState(0);

    const [openAddNewCopyDialog, setOpenAddNewCopyDialog] = useState(false);
    const [openManageCopyDialog, setOpenManageCopyDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [selectedCopy, setSelectedCopy] = useState<BookCopyRequest | null>(null);

    useEffect(() => {
        dispatch(fetchBookCopiesByBookId({ bookId, page: currentPage }));
    }, [dispatch, bookId, currentPage]);

    const handlePagination = (page: number) => {
        setCurrentPage(page);
    };

    const handleUpdate = async (newSelectCopy: BookCopyRequest) => {

        if (deepEqual(newSelectCopy, selectedCopy)) {
            return;
        }

        const result = await dispatch(updateBookCopy(newSelectCopy));
        await dispatch(fetchBookCopiesByBookId({ bookId, page: currentPage }));

        if (updateBookCopy.fulfilled.match(result)) {
            toast.success("Book copy updated");
        } else {
            toast.error("An error occurred during updating the book copy")
        }

        setOpenManageCopyDialog(false);
    };

    const handleConfirmDeleteBookCopy = async (bookCopyId: string) => {
        const result = await dispatch(deleteBookCopy(bookCopyId))

        if (deleteBookCopy.fulfilled.match(result)) {
            toast.success("Book copy deleted");
            await dispatch(fetchBookCopiesByBookId({ bookId, page: currentPage }))
        } else {
            toast.error("An error occurred during deleting the book copy")
        }
        setOpenDeleteDialog(false);
        setOpenManageCopyDialog(false);
    };

    const handleOpenManageDialog = (copy: BookCopyRequest) => {
        setSelectedCopy({
            bookCopyId: copy.bookCopyId,
            itemReferenceCopy: copy.itemReferenceCopy,
            physicalLocation: copy.physicalLocation,
            status: copy.status,
        });
        setOpenManageCopyDialog(true);
    };

    if (status === "loading") return <p>Loading...</p>;

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg pt-4 flex items-center justify-between">
                All Copies
                <AddNewCopyDialog
                    open={openAddNewCopyDialog}
                    setOpen={setOpenAddNewCopyDialog}
                    bookId={bookId}
                    currentPage={currentPage}
                />
            </h3>

            <BookCopyTable
                copies={copies.content}
                onManage={handleOpenManageDialog}
            />

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

            {selectedCopy && (
                <ManageCopyDialog
                    handleUpdate={handleUpdate}
                    handleConfirmDeleteBookCopy={handleConfirmDeleteBookCopy}
                    openManageCopyDialog={openManageCopyDialog}
                    setOpenManageCopyDialog={setOpenManageCopyDialog}
                    openDeleteDialog={openDeleteDialog}
                    setOpenDeleteDialog={setOpenDeleteDialog}
                    selectedCopy={selectedCopy}
                />
            )}
        </div>
    );
};

export default BookCopyManage;
