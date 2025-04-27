import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
    SelectItem,
} from "@/components/ui/select.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useEffect, useMemo, useState } from "react";
import { allBooksFilters } from "@/store/bookSlice.ts";
import { useAppDispatch, useAppSelector } from "@/store/store.ts";
import {useDebouncedValue} from "@/hooks/use-debounced-value.ts";
import capitalizer from "@/utils/capitalizer.ts";

type Category = Record<string, number>;

interface CategorySelectProps {
    value: string;
    onChange: (value: string) => void;
}

const CategorySelect = ({ value, onChange }: CategorySelectProps) => {
    const dispatch = useAppDispatch();
    const { categories: fetchedCategories } = useAppSelector((state) => state.book);

    const [categories, setCategories] = useState<Category>({});
    const [newCategory, setNewCategory] = useState("");

    useEffect(() => {
        dispatch(allBooksFilters());
    }, [dispatch]);

    useEffect(() => {
        setCategories(fetchedCategories);
    }, [fetchedCategories]);

    const categoryNames = useMemo(() => Object.keys(categories), [categories]);

    const debouncedNewCategory = useDebouncedValue(newCategory, 200);

    const similarCategories = useMemo(() => {
        const lower = debouncedNewCategory.toLowerCase();
        return categoryNames.filter(
            (c) => c.toLowerCase().includes(lower) && lower.length > 0
        );
    }, [debouncedNewCategory, categoryNames]);

    const alreadyExists = categoryNames.some(
        (c) => c.toLowerCase() === newCategory.trim().toLowerCase()
    );

    const handleAddCategory = () => {
        const trimmed = newCategory.trim();
        if (trimmed && !alreadyExists) {
            setCategories((prev) => ({
                ...prev,
                [trimmed]: -1,
            }));
            onChange(trimmed);
            setNewCategory("");
        }
    };

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
                <SelectValue placeholder="Select or create category">
                    {value}
                </SelectValue>
            </SelectTrigger>

            <SelectContent className="p-0">
                {/* Fixed Input Area */}
                <div className="sticky top-0 z-10 bg-white p-2 border-b space-y-2">
                    <Input
                        placeholder="New category..."
                        value={newCategory}
                        onChange={(e) => setNewCategory(capitalizer(e.target.value))}
                        onKeyDown={(e) => e.stopPropagation()} // Keeps focus in the input
                    />
                    <Button
                        className="w-full"
                        variant="secondary"
                        size="sm"
                        onClick={handleAddCategory}
                        disabled={!newCategory.trim() || alreadyExists}
                    >
                        {alreadyExists ? "Already exists" : "Add Category"}
                    </Button>
                </div>

                {/* Scrollable Select Items */}
                <div className="max-h-40 overflow-y-auto">
                    {(debouncedNewCategory.trim() ? similarCategories : categoryNames).map(
                        (cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
                            </SelectItem>
                        )
                    )}
                </div>
            </SelectContent>
        </Select>
    );
};

export default CategorySelect;
