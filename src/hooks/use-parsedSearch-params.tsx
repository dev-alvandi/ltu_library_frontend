import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

// You can also define types if you want more control
type SearchKey =
    | "query"
    | "availabilities"
    | "categories"
    | "languages"
    | "minYear"
    | "maxYear";

export const useParsedSearchParams = (keys: SearchKey[]) => {
    const [searchParams] = useSearchParams();

    return useMemo(() => {
        const result: Record<string, string | string[] | number | null> = {};

        for (const key of keys) {
            const value = searchParams.get(key);

            if (!value) {
                result[key] = key === "minYear"
                    ? 1000
                    : key === "maxYear"
                        ? new Date().getFullYear()
                        : key === "query"
                            ? ""
                            : [];
                continue;
            }

            if (["availabilities", "categories", "languages"].includes(key)) {
                result[key] = value.split(",").filter(Boolean);
            } else if (["minYear", "maxYear"].includes(key)) {
                result[key] = parseInt(value, 10);
            } else {
                result[key] = value;
            }
        }

        return result;
    }, [searchParams, keys]);
};
