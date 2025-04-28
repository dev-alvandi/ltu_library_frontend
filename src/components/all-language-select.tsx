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
import { fetchAllLanguages } from "@/store/bookSlice.ts"; // <- you might need to add this thunk
import capitalizer from "@/utils/capitalizer.ts";

interface AllLanguagesSelectProps {
    value: string;
    onChange: (value: string) => void;
}

const AllLanguagesSelect = ({ value, onChange }: AllLanguagesSelectProps) => {
    const dispatch = useAppDispatch();
    const { allLanguages } = useAppSelector((state) => state.book);

    const [newLanguage, setNewLanguage] = useState("");

    useEffect(() => {
        dispatch(fetchAllLanguages()); // <- you should already have or quickly add this
    }, [dispatch]);

    const debouncedNewLanguage = useDebouncedValue(newLanguage, 200);

    const similarLanguages = useMemo(() => {
        const lower = debouncedNewLanguage.toLowerCase();
        return allLanguages.filter(
            (lang) => lang.toLowerCase().includes(lower) && lower.length > 0
        );
    }, [debouncedNewLanguage, allLanguages]);

    const alreadyExists = allLanguages.some(
        (lang) => lang.toLowerCase() === newLanguage.trim().toLowerCase()
    );

    const handleAddLanguage = () => {
        const trimmed = newLanguage.trim();
        if (trimmed && !alreadyExists) {
            onChange(trimmed);
            setNewLanguage("");
        }
    };

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
                <SelectValue placeholder="Select or create language" />
            </SelectTrigger>

            <SelectContent className="p-0">
                {/* Fixed Input Area */}
                <div className="sticky top-0 z-10 bg-white p-2 border-b space-y-2">
                    <Input
                        placeholder="New language..."
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(capitalizer(e.target.value))}
                        onKeyDown={(e) => e.stopPropagation()}
                    />
                    <Button
                        className="w-full"
                        variant="secondary"
                        size="sm"
                        onClick={handleAddLanguage}
                        disabled={!newLanguage.trim() || alreadyExists}
                    >
                        {alreadyExists ? "Already exists" : "Add Language"}
                    </Button>
                </div>

                {/* Scrollable Select Items */}
                <div className="max-h-40 overflow-y-auto">
                    {(debouncedNewLanguage.trim() ? similarLanguages : allLanguages).map((lang) => (
                        <SelectItem key={lang} value={lang}>
                            {lang}
                        </SelectItem>
                    ))}
                </div>
            </SelectContent>
        </Select>
    );
};

export default AllLanguagesSelect;
