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
import { useDispatch } from "react-redux";
import { createBookCopy, fetchBookCopiesByBookId } from "@/store/bookCopySlice";
import { toast } from "react-toastify";
import { Formik, Form } from "formik";

const AddNewCopyDialog = ({ open, setOpen, bookId, currentPage }: any) => {
    const dispatch = useDispatch();

    const handleCreateSubmit = async (
        values: { type: string; location: string },
        { setSubmitting, resetForm }: any
    ) => {
        const result = await dispatch(createBookCopy({
            bookCopyId: bookId,
            physicalLocation: values.location,
            itemReferenceCopy: values.type === "REFERENCE"
        }) as any);

        await dispatch(fetchBookCopiesByBookId({ bookId, page: currentPage }) as any);

        if (createBookCopy.fulfilled.match(result)) {
            toast.success("Book copy created successfully");
            resetForm();
            setOpen(false);
        } else {
            toast.error("Something went wrong during creating the book copy");
        }

        setSubmitting(false);
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

                <Formik
                    initialValues={{ type: "", location: "" }}
                    onSubmit={handleCreateSubmit}
                >
                    {({ values, handleChange, setFieldValue }) => (
                        <Form className="space-y-4 mt-4">
                            <div className="flex flex-col gap-2">
                                <label>Type</label>
                                <Select value={values.type} onValueChange={(val) => setFieldValue("type", val)}>
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
                                    name="location"
                                    value={values.location}
                                    onChange={handleChange}
                                    placeholder="Enter location"
                                    className="bg-[#2c2c2f]"
                                />
                            </div>

                            <DialogFooter className="flex justify-end gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    className="bg-[#2c2c2f] text-white"
                                    type="button"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">Create</Button>
                            </DialogFooter>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default AddNewCopyDialog;
