import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription, DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {useAppDispatch, useAppSelector} from "@/store/store.ts";
import {deleteBookCopy} from "@/store/bookCopySlice.ts";
import {toast} from "react-toastify";

const ManageCopyDialog = ({
                              handleUpdate,
                              openManageCopyDialog, setOpenManageCopyDialog,
                              openDeleteDialog, setOpenDeleteDialog,
                              selectedCopy, setSelectedCopy,
                              bookCopyType, setBookCopyType,
                              bookCopyLocation, setBookCopyLocation,
                              bookCopyStatus, setBookCopyStatus,
                          }: any) => {

    const dispatch = useAppDispatch();

    const {status} = useAppSelector(state => state.bookCopy)

    const handleConfirmDelete = async () => {
        // console.log(selectedCopy.id)
        await dispatch(deleteBookCopy(selectedCopy.id))

        if (status === "succeeded") {
            toast.success("Book copy deleted");
        } else {
            toast.error("An error occurred during deleting the book copy")
        }

        setOpenDeleteDialog(false);
        setOpenManageCopyDialog(false);
    };

    const handleStatusChange = (status: string) => {
        setBookCopyStatus(status);
        setSelectedCopy((prev: any) => ({
            ...prev,
            status,
        }));
    };

    const handleTypeChange = (type: string) => {
        setBookCopyType(type);
        setSelectedCopy((prev: any) => ({
            ...prev,
            type,
        }));
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const physicalLocation = e.target.value;
        setBookCopyLocation(physicalLocation);
        setSelectedCopy((prev: any) => ({
            ...prev,
            physicalLocation    ,
        }));
    };

    return (
        <Dialog open={openManageCopyDialog} onOpenChange={setOpenManageCopyDialog}>
            <DialogContent className="bg-[#030712] text-white border border-[#2a2a2a] rounded-lg">
                <DialogHeader>
                    <DialogTitle>Manage Book Copy</DialogTitle>
                    <DialogDescription>
                        You can edit or delete the existing Book Copy.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {(selectedCopy?.status === "AVAILABLE" || selectedCopy?.status === "LOST") && (
                        <div className="flex flex-col gap-2">
                            <label>Status</label>
                            <Select value={bookCopyStatus} onValueChange={handleStatusChange}>
                                <SelectTrigger className="bg-[#2c2c2f]">
                                    <SelectValue placeholder="Select status..." />
                                </SelectTrigger>
                                <SelectContent className="bg-[#2c2c2f]">
                                    <SelectItem className="text-white" value="AVAILABLE">Available</SelectItem>
                                    <SelectItem className="text-white" value="LOST">Lost</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label>Type</label>
                        <Select value={bookCopyType} onValueChange={handleTypeChange}>
                            <SelectTrigger className="bg-[#2c2c2f]">
                                <SelectValue placeholder="Select type..." />
                            </SelectTrigger>
                            <SelectContent className="bg-[#2c2c2f]">
                                <SelectItem className="text-white" value="REFERENCE">Reference</SelectItem>
                                <SelectItem className="text-white" value="BORROWABLE">Borrowable</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>Location</label>
                        <Input
                            value={bookCopyLocation}
                            onChange={handleLocationChange}
                            placeholder="Enter location"
                            className="bg-[#2c2c2f]"
                        />
                    </div>
                </div>

                <DialogFooter className="flex justify-end gap-2 pt-4">
                    <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                        <DialogTrigger asChild>
                            <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                                Delete Book
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="bg-[#030712] text-white border border-[#2a2a2a] rounded-lg">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-semibold">Confirm Deletion</DialogTitle>
                                <DialogDescription className="text-white">
                                    Are you sure you want to delete this Book Copy?
                                </DialogDescription>
                            </DialogHeader>

                            <DialogFooter className="pt-4 flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setOpenDeleteDialog(false)}
                                    className="bg-[#2c2c2f] text-white hover:bg-[#3a3a3f]"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleConfirmDelete}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Confirm Delete
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Button
                        variant="outline"
                        className="bg-[#2c2c2f] text-white"
                        onClick={() => setOpenManageCopyDialog(false)}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate}>
                        Update
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ManageCopyDialog;
