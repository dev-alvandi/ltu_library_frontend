import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import axios from "axios";

const searchSchema = z.object({
    query: z.string().trim().min(1, "Search term required"),
});

interface Props {
    onSearch: (query: string) => void;
    searchTerm?: string;
}

const SearchGrid = ({ onSearch, searchTerm = "" }: Props) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const formik = useFormik({
        initialValues: { query: searchTerm },
        enableReinitialize: true,
        validate: (values) => {
            try {
                searchSchema.parse(values);
                return {};
            } catch (e: any) {
                return { query: e.errors?.[0]?.message || "Invalid input" };
            }
        },
        onSubmit: (values) => {
            onSearch(values.query.trim());
            setShowSuggestions(false);
        },
    });

    // Fetch suggestions on keydown/change
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (formik.values.query.length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                const res = await axios.get(`/api/book/suggestions?query=${encodeURIComponent(formik.values.query)}`);

                if (Array.isArray(res.data)) {
                    setSuggestions(res.data);
                } else {
                    console.warn("Unexpected suggestion response:", res.data);
                    setSuggestions([]);
                }

                setShowSuggestions(true);
            } catch (error) {
                console.error("Failed to fetch suggestions:", error);
                setSuggestions([]);
            }
        };

        const debounce = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounce);
    }, [formik.values.query]);

    return (
        <div className="w-full relative max-w-xl">
            <form onSubmit={formik.handleSubmit} className="w-full flex items-center gap-4 mb-4">
                <Input
                    name="query"
                    value={formik.values.query}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Search by title, ISBN, author, or publisher..."
                    className="w-full max-w-lg py-6"
                    autoComplete="off"
                />
                <Button className="cursor-pointer py-6 px-8" type="submit">Search</Button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white shadow-md border rounded-md max-h-60 overflow-y-auto">
                    {suggestions.map((s, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                formik.setFieldValue("query", s);
                                setShowSuggestions(false);
                                onSearch(s);
                            }}
                            className="px-4 py-2 cursor-pointer hover:bg-accent"
                        >
                            {s}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchGrid;
