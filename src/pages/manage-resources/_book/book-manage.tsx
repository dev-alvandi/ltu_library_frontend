import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "@/store/store.ts";
import {useFormik} from "formik";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import ImageUploader from "@/components/image-uploader";
import ExistingCategorySelect from "@/components/existing-category-select.tsx";
import ExistingLanguageSelect from "@/components/existing-language-select.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { useState } from "react";
import {deleteBook, fetchBookById, updateBook} from "@/store/bookSlice";
import {toast} from "react-toastify";
import BookCopyManage from "@/pages/manage-resources/_book/_book-copy/book-copy-manage.tsx";
import {useNavigate} from "react-router";
import {UNAUTHENTICATED_NAVBAR_PATHS} from "@/constants.ts";

const BookManage = ({id}: { id: string }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const {fetchedBook, status} = useAppSelector((state) => state.book);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: fetchedBook?.title || "",
            isbn: fetchedBook?.isbn || "",
            author: fetchedBook?.author || "",
            publisher: fetchedBook?.publisher || "",
            publishedYear: fetchedBook?.publishedYear || "",
            bookType: fetchedBook?.bookType || "",
            language: fetchedBook?.language || "",
            category: fetchedBook?.bookCategory.subject || "",
            image: fetchedBook?.imageUrl || null,
        },
        onSubmit: (values) => {

            const formData = new FormData();
            formData.append("bookId", id); // include bookId
            formData.append("title", values.title);
            formData.append("isbn", values.isbn);
            formData.append("author", values.author);
            formData.append("publisher", values.publisher);
            formData.append("publishedYear", values.publishedYear.toString());
            formData.append("bookType", values.bookType);
            formData.append("language", values.language);
            formData.append("category", values.category);


            Object.entries(values as Record<string, string | number | File | null>).forEach(([key, value]) => {
                if (key === "image" && value instanceof File) {
                    formData.append("image", value);
                } else if (value !== null) {
                    formData.append(key, value.toString());
                }
            });

            console.log(formData);
            dispatch(updateBook({bookId: id, updatedData: formData}));
            if (status === "succeeded") {
                toast.success("Book updated successfully");
            } else if (status === "failed") {
                toast.error("Failed to update book");
            }
        },
    });

    useEffect(() => {
        dispatch(fetchBookById(id));
    }, [dispatch, id]);

    const handleConfirmDelete = async () => {
        await dispatch(deleteBook(id));

        if (status === "succeeded") {
            toast.success("Book deleted");
            navigate(UNAUTHENTICATED_NAVBAR_PATHS["Books"])
        } else {
            toast.error("An error occurred during deleting the book")
        }
    }

    return (
        <>
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold capitalize">Manage Book</h1>
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
                                Are you sure you want to delete this book? Deleting will also remove <span className="font-bold">all copies</span>.
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
            </div>
            <form
                onSubmit={formik.handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12"
            >
                <div className=" flex flex-col gap-1">
                    <ImageUploader
                        label="Book Image"
                        value={formik.values.image}
                        onChange={(file) => formik.setFieldValue("image", file)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="title">Title</label>
                        <Input
                            name="title"
                            id="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="isbn">ISBN</label>
                        <Input
                            name="isbn"
                            id="isbn"
                            value={formik.values.isbn}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="author">Author</label>
                        <Input
                            name="author"
                            id="author"
                            value={formik.values.author}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="publisher">Publisher</label>
                        <Input
                            name="publisher"
                            id="publisher"
                            value={formik.values.publisher}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="year">Published Year</label>
                        <Input
                            name="year"
                            id="year"
                            type="number"
                            value={formik.values.publishedYear}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="type">Book Type</label>
                        <Select
                            value={formik.values.bookType}
                            onValueChange={(val) => formik.setFieldValue("type", val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Book Type">
                                    {formik.values.bookType}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Course Literature">Course Literature</SelectItem>
                                <SelectItem value="Public">Public</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="language">Language</label>
                        <ExistingLanguageSelect
                            value={formik.values.language}
                            onChange={(val) => formik.setFieldValue("language", val)}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="category">Category</label>
                        <ExistingCategorySelect
                            value={formik.values.category}
                            onChange={(val) => formik.setFieldValue("category", val)}
                        />
                    </div>
                </div>

                <Button type="submit" className="w-full mt-2 col-span-2 bg-blue-600 hover:bg-blue-700">
                    Update Book
                </Button>
            </form>


            <div className="col-span-2">
                <h2 className="text-2xl font-bold capitalize mb-4">Manage Book Copies</h2>
                <BookCopyManage bookId={id}/>
            </div>
        </>
    );
};

export default BookManage;