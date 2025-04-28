import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useEffect, useMemo, useState } from "react";
import { useDebouncedValue } from "@/hooks/use-debounced-value.ts";
import { useAppDispatch, useAppSelector } from "@/store/store.ts";
import { fetchAllCategories } from "@/store/bookSlice.ts"; //
import capitalizer from "@/utils/capitalizer.ts";

interface AllCategoriesSelectProps {
    value: string;
    onChange: (value: string) => void;
}

const AllCategoriesSelect = ({ value, onChange }: AllCategoriesSelectProps) => {
    const dispatch = useAppDispatch();
    const { allCategories } = useAppSelector((state) => state.book);

    const [newCategory, setNewCategory] = useState("");

    useEffect(() => {
        dispatch(fetchAllCategories()); // Dispatch to fetch all categories from backend
    }, [dispatch]);

    const debouncedNewCategory = useDebouncedValue(newCategory, 200);

    const similarCategories = useMemo(() => {
        const lower = debouncedNewCategory.toLowerCase();
        return allCategories.filter(
            (cat) => cat.toLowerCase().includes(lower) && lower.length > 0
        );
    }, [debouncedNewCategory, allCategories]);

    const alreadyExists = allCategories.some(
        (cat) => cat.toLowerCase() === newCategory.trim().toLowerCase()
    );

    const handleAddCategory = () => {
        const trimmed = newCategory.trim();
        if (trimmed && !alreadyExists) {
            onChange(trimmed);
            setNewCategory("");
        }
    };

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
                <SelectValue placeholder="Select or create category" />
            </SelectTrigger>

            <SelectContent className="p-0">
                {/* Fixed Input Area */}
                <div className="sticky top-0 z-10 bg-white p-2 border-b space-y-2">
                    <Input
                        placeholder="New category..."
                        value={newCategory}
                        onChange={(e) => setNewCategory(capitalizer(e.target.value))}
                        onKeyDown={(e) => e.stopPropagation()}
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
                    {(debouncedNewCategory.trim() ? similarCategories : allCategories).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                            {cat}
                        </SelectItem>
                    ))}
                </div>
            </SelectContent>
        </Select>
    );
};

export default AllCategoriesSelect;
