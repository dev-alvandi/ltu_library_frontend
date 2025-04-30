import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { z, ZodError } from "zod";
import { useAppDispatch, useAppSelector } from "@/store/store.ts";
import { fetchSuggestions } from "@/store/book-slice.ts";

const searchSchema = z.object({
    query: z.string().trim().min(1, "Search term required"),
});

interface Props {
    searchTerm?: string;
    setSearchTerm: (searchTerm: string) => void;
}

const SearchBookGrid = ({ searchTerm = "", setSearchTerm }: Props) => {
    const dispatch = useAppDispatch();
    const suggestions = useAppSelector((state) => state.book.suggestions);

    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const formik = useFormik({
        initialValues: { query: searchTerm },
        enableReinitialize: true,
        validate: (values) => {
            try {
                searchSchema.parse(values);
                return {};
            } catch (e) {
                if (e instanceof ZodError) {
                    return { query: e.errors?.[0]?.message || "Invalid input" };
                }
                return { query: "Validation failed" };
            }
        },
        onSubmit: (values) => {
            const trimmed = values.query.trim();
            setShowSuggestions(false);
            setSearchTerm(trimmed);
        },
    });

    useEffect(() => {
        const query = formik.values.query.trim();

        if (query.length < 2) {
            setShowSuggestions(false);
            return;
        }

        const timeout = setTimeout(() => {
            dispatch(fetchSuggestions(query));
            setShowSuggestions(true);
        }, 300);

        return () => clearTimeout(timeout);
    }, [formik.values.query, dispatch]);

    const handleSelect = (value: string) => {
        formik.setFieldValue("query", value);
        setShowSuggestions(false);
        setSearchTerm(value);
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
        <div className="w-full relative max-w-xl">
            <form onSubmit={formik.handleSubmit} className="w-full flex gap-4 mb-4">
                <Input
                    name="query"
                    ref={inputRef}
                    value={formik.values.query}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Search by title, ISBN, author, or publisher..."
                    className="w-full max-w-lg py-6"
                    autoComplete="off"
                />
                <Button className="cursor-pointer py-6 px-8" type="submit">
                    Search
                </Button>
            </form>

            {showSuggestions && Object.values(suggestions).some((list) => list.length > 0) && (
                <div
                    ref={suggestionsRef}
                    className="absolute top-full left-0 w-full z-10 bg-white shadow-md border rounded-md max-h-60 overflow-y-auto"
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
    );
};

export default SearchBookGrid;