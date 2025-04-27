import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { z, ZodError } from "zod";
import { useAppDispatch, useAppSelector } from "@/store/store.ts";
import { fetchSuggestions } from "@/store/bookSlice.ts";

const searchSchema = z.object({
    bookQuery: z.string().trim().min(1, "Search term required")
});

const BookCopyForm = () => {
    const dispatch = useAppDispatch();
    const suggestions = useAppSelector((state) => state.book.suggestions);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const formik = useFormik({
        initialValues: {
            location: "",
            bookQuery: "",
        },
        validate: (values) => {
            try {
                searchSchema.parse(values);
                return {};
            } catch (e) {
                if (e instanceof ZodError) {
                    return { bookQuery: e.errors?.[0]?.message || "Invalid input" };
                }
                return { bookQuery: "Validation failed" };
            }
        },
        onSubmit: (values) => {
            console.log("Book Copy submitted:", values);
        },
    });

    useEffect(() => {
        const query = formik.values.bookQuery.trim();

        if (query.length < 2) {
            setShowSuggestions(false);
            return;
        }

        const timeout = setTimeout(() => {
            dispatch(fetchSuggestions(query));
            setShowSuggestions(true);
        }, 300);

        return () => clearTimeout(timeout);
    }, [formik.values.bookQuery, dispatch]);

    const handleSelect = (value: string) => {
        formik.setFieldValue("bookQuery", value);
        setShowSuggestions(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node) &&
                !inputRef.current?.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4 relative">
            <div className="flex flex-col gap-1 relative">
                <label htmlFor="bookQuery">Search Book</label>
                <Input
                    name="bookQuery"
                    id="bookQuery"
                    ref={inputRef}
                    value={formik.values.bookQuery}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Search by title, ISBN, author, or publisher..."
                    className="w-full"
                    autoComplete="off"
                />

                {showSuggestions && Object.values(suggestions).some((list) => list.length > 0) && (
                    <div
                        ref={suggestionsRef}
                        className="absolute top-full left-0 w-full z-10 bg-white shadow-md border rounded-md max-h-60 overflow-y-auto mt-1"
                    >
                        {Object.entries(suggestions).map(([field, values]) =>
                            values.length > 0 ? (
                                <div key={field}>
                                    <div className="px-4 py-2 text-sm font-semibold text-muted-foreground capitalize border-b">
                                        {field}
                                    </div>
                                    {(values as string[]).map((value: string, i: number) => (
                                        <div
                                            key={`${field}-${i}`}
                                            onClick={() => handleSelect(value)}
                                            className="px-4 py-2 cursor-pointer text-gray-500 hover:bg-accent"
                                        >
                                            {value}
                                        </div>
                                    ))}
                                </div>
                            ) : null
                        )}
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="location">Location in the library</label>
                <Input
                    name="location"
                    id="location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                />
            </div>

            <Button
                type="submit"
                className="w-full mt-2 custom-btn bg-(--color-blue-theme) text-white"
            >
                Add New Book Copy
            </Button>
        </form>
    );
};

export default BookCopyForm;
