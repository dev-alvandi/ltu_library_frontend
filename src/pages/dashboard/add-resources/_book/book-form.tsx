import {useFormik} from "formik";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import ImageUploader from "@/components/image-uploader.tsx";
import ExistingCategorySelect from "@/components/existing-category-select.tsx";
import ExistingLanguageSelect from "@/components/existing-language-select.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select.tsx";
import {useAppDispatch, useAppSelector} from "@/store/store.ts";
import {createBook} from "@/store/bookSlice.ts";
import {toast} from "react-toastify";
import {useEffect, useState} from "react";

const BookForm = () => {

    const dispatch = useAppDispatch();
    const {status} = useAppSelector((state) => state.book);

    const [submitted, setSubmitted] = useState(false);

    const formik = useFormik({
        initialValues: {
            title: "",
            isbn: "",
            author: "",
            publisher: "",
            publishedYear: "",
            bookType: "",
            language: "",
            category: "",
            image: null,
        },
        onSubmit: (values) => {

            console.log(values)

            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("isbn", values.isbn);
            formData.append("author", values.author);
            formData.append("publisher", values.publisher);
            formData.append("publishedYear", String(values.publishedYear));
            formData.append("bookType", values.bookType === "Course Literature" ? "COURSE_LITERATURE" : "PUBLIC");
            formData.append("language", values.language);
            formData.append("category", values.category);
            if (values.image) {
                formData.append("image", values.image);
            }

            dispatch(createBook(formData));
            setSubmitted(true);
        },
    });

    useEffect(() => {
        if (!submitted) return;

        if (status === "succeeded") {
            toast.success("Book added successfully");
            formik.resetForm();
        } else if (status === "failed") {
            toast.error("Failed to add book");
        }
    }, [status, submitted]);

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
            {/* Left column for image uploader */}
            <div className="flex flex-col gap-1">
                <ImageUploader
                    label="Book Image"
                    value={formik.values.image}
                    onChange={(file) => formik.setFieldValue("image", file)}
                />
            </div>

            {/* Right column for the form fields */}
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
                    <label htmlFor="publishedYear">Published Year</label>
                    <Input
                        name="publishedYear"
                        id="publishedYear"
                        type="number"
                        value={formik.values.publishedYear}
                        onChange={formik.handleChange}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="bookType">Book Type</label>
                    <Select
                        value={formik.values.bookType}
                        onValueChange={(val) => formik.setFieldValue("bookType", val)}
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
            <Button type="submit" className="w-full mt-2 col-span-2">
                Add New Book
            </Button>
        </form>
    );
};

export default BookForm;
