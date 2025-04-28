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
import { useAppDispatch, useAppSelector } from "@/store/store.ts";
import { useDebouncedValue } from "@/hooks/use-debounced-value.ts";
import { allBooksFilters } from "@/store/bookSlice.ts";
import capitalizer from "@/utils/capitalizer.ts";

interface ExistingLanguageSelectProps {
    value: string;
    onChange: (value: string) => void;
}

const ExistingLanguageSelect = ({ value, onChange }: ExistingLanguageSelectProps) => {
    const dispatch = useAppDispatch();
    const { languages: fetchedLanguages } = useAppSelector((state) => state.book);

    const [languages, setLanguages] = useState<Record<string, number>>({});
    const [newLanguage, setNewLanguage] = useState("");

    useEffect(() => {
        dispatch(allBooksFilters());
    }, [dispatch]);

    useEffect(() => {
        setLanguages(fetchedLanguages);
    }, [fetchedLanguages]);

    const languageNames = useMemo(() => Object.keys(languages), [languages]);

    const debouncedNewLanguage = useDebouncedValue(newLanguage, 200);

    const similarLanguages = useMemo(() => {
        const lower = debouncedNewLanguage.toLowerCase();
        return languageNames.filter(
            (lang) => lang.toLowerCase().includes(lower) && lower.length > 0
        );
    }, [debouncedNewLanguage, languageNames]);

    const alreadyExists = languageNames.some(
        (lang) => lang.toLowerCase() === newLanguage.trim().toLowerCase()
    );

    const handleAddLanguage = () => {
        const trimmed = newLanguage.trim();
        if (trimmed && !alreadyExists) {
            setLanguages((prev) => ({
                ...prev,
                [trimmed]: -1, // You use -1 for newly added local-only languages
            }));
            onChange(trimmed);
            setNewLanguage("");
        }
    };

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
                <SelectValue placeholder="Select or create language">
                    {value}
                </SelectValue>
            </SelectTrigger>

            <SelectContent className="p-0">
                {/* Language Input at the Top */}
                <div className="sticky top-0 z-10 bg-white p-2 border-b space-y-2">
                    <Input
                        placeholder="New language..."
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(capitalizer(e.target.value))}
                        onKeyDown={(e) => e.stopPropagation()} // Keep focus in the input
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

                {/* Language List */}
                <div className="max-h-40 overflow-y-auto">
                    {(debouncedNewLanguage.trim() ? similarLanguages : languageNames).map(
                        (lang) => (
                            <SelectItem key={lang} value={lang}>
                                {lang}
                            </SelectItem>
                        )
                    )}
                </div>
            </SelectContent>
        </Select>
    );
};

export default ExistingLanguageSelect;
