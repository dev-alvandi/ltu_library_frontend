import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createBookCopy, fetchBookCopiesByBookId } from "@/store/bookCopySlice";

const AddNewCopyDialog = ({ open, setOpen, bookId, currentPage }: any) => {
    const dispatch = useDispatch();
    const [type, setType] = useState("");
    const [location, setLocation] = useState("");

    const handleCreate = async () => {
        await dispatch(createBookCopy({
            bookCopyId: bookId,
            physicalLocation: location,
            itemReferenceCopy: type === "REFERENCE"
        }) as any);
        await dispatch(fetchBookCopiesByBookId({ bookId, page: currentPage }) as any);
        setOpen(false);
        setLocation("");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Add New Copy
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#030712] text-white border border-[#2a2a2a] rounded-lg">
                <DialogHeader>
                    <DialogTitle>Add New Book Copy</DialogTitle>
                    <DialogDescription>
                        You can add a new Book Copy.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div className="flex flex-col gap-2">
                        <label>Type</label>
                        <Select onValueChange={setType}>
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
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter location"
                            className="bg-[#2c2c2f]"
                        />
                    </div>
                </div>

                <DialogFooter className="flex justify-end gap-2 pt-4">
                    <Button
                        variant="outline"
                        className="bg-[#2c2c2f] text-white"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleCreate}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddNewCopyDialog;
