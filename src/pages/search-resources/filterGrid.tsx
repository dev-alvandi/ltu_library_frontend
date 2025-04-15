import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import { FILTERS_TYPE } from "./type";
import { ALL_POSSIBLE_RESOURCES } from "@/constants.ts";
import {useCallback, useEffect, useMemo} from "react";
import {useSearchParams} from "react-router";
import {normalizeFiltersFromParams} from "@/utils/normalizeFilters.ts";
import {useParsedSearchParams} from "@/hooks/use-parsedSearch-params.tsx";

const availabilities = ["Available to Borrow", "Reserved Only"] as const;

const filterSchema = z.object({
    availabilities: z.array(z.enum(availabilities)),
    categories: z.record(z.string(), z.number()),
    languages: z.record(z.string(), z.number()),
    minYear: z.number().min(1000).max(new Date().getFullYear()),
    maxYear: z.number().min(1000).max(new Date().getFullYear()),
});

type FilterFormType = z.infer<typeof filterSchema>;

interface Props {
    userFilters: FILTERS_TYPE;
    allFilters: FILTERS_TYPE
    setUserFilters: (filters: FILTERS_TYPE) => void;
    resourceName: string;
}

const FilterGrid = ({
                        allFilters,
                        setUserFilters,
                        resourceName,
                    }: Props) => {
    // const [, setSearchParams] = useSearchParams({})

    const formik = useFormik<FilterFormType>({
        initialValues: allFilters,
        enableReinitialize: true,
        validationSchema: toFormikValidationSchema(filterSchema),
        onSubmit: (values) => {
            // setSearchParams({});
            //
            // const params = new URLSearchParams();
            //
            // console.log("Formik values: ", formik.values);
            //
            //
            // params.set("availabilities", formik.values.availabilities.join(','))
            // params.set("minYear", formik.values.minYear.toString())
            // params.set("maxYear", formik.values.maxYear.toString())
            // params.set("categories", Object.keys(formik.values.categories).join(','))
            // params.set("languages", Object.keys(formik.values.languages).join(','))
            //
            // console.log("Params: ", params);
            //
            // setSearchParams(params);

            setUserFilters(values);
        },
    });

    // const rawParams = useParsedSearchParams([
    //     "availabilities",
    //     "languages",
    //     "categories",
    //     "minYear",
    //     "maxYear",
    // ]);


    // 🔧 Normalize params to FILTERS_TYPE
    // const normalizedFilters = useMemo(() => {
    //     return normalizeFiltersFromParams(rawParams);
    // }, [rawParams]);

    // useEffect(() => {
        // formik.setValues(prev => ({
        //     ...prev,
        //     minYear: normalizedFilters.minYear,
        //     maxYear: normalizedFilters.maxYear,
        // }));
    // }, []);

    const toggleArrayValue = (field: keyof FilterFormType, value: string) => {
        const array = formik.values[field] as string[];
        formik.setFieldValue(
            field,
            array.includes(value) ? array.filter((v) => v !== value) : [...array, value]
        );
    };

    const handleCategoryChange = useCallback((val: string[]) => {
        const updated = val.reduce((acc, key) => {
            if (allFilters.categories[key] !== undefined) {
                acc[key] = allFilters.categories[key];
            }
            return acc;
        }, {} as Record<string, number>);

        formik.setFieldValue("categories", updated);
    }, [allFilters.categories, formik]);

    const handleLanguageChange = useCallback((val: string[]) => {
        const updated = val.reduce((acc, key) => {
            if (allFilters.languages[key] !== undefined) {
                acc[key] = allFilters.languages[key];
            }
            return acc;
        }, {} as Record<string, number>);


        formik.setFieldValue("languages", updated);
    }, [allFilters.languages, formik]);



    return (
        <form onSubmit={formik.handleSubmit} className="h-full relative flex flex-col px-4 gap-5">
            <h2 className="text-lg font-semibold">Filters</h2>

            {/* Availabilities */}
            {resourceName !== ALL_POSSIBLE_RESOURCES["magazines"] && (
                <div>
                    <p className="font-medium mb-1">Availabilities</p>
                    {availabilities.map((availability) => (
                        <label key={availability} className="flex items-center gap-2">
                            <Checkbox
                                checked={formik.values.availabilities.includes(availability)}
                                onCheckedChange={() => toggleArrayValue("availabilities", availability)}
                            />
                            {availability}
                        </label>
                    ))}
                </div>
            )}

            {/* Year Range */}
            <div className="flex gap-2">
                <Input
                    type="number"
                    name="minYear"
                    placeholder="From Year"
                    // defaultValue={normalizedFilters.minYear}
                    onChange={formik.handleChange}
                    min={formik.values.minYear}
                    max={formik.values.maxYear}
                />
                <Input
                    type="number"
                    name="maxYear"
                    placeholder="To Year"
                    // defaultValue={normalizedFilters.maxYear}
                    onChange={formik.handleChange}
                    min={formik.values.minYear}
                    max={formik.values.maxYear}
                />
            </div>

            {/* Categories */}
            <MultiSelect
                options={Object.keys(allFilters.categories).map((cat) => ({
                    label: `${cat} (${allFilters.categories[cat]})`,
                    value: cat,
                }))}
                value={Object.keys(formik.values.categories)}
                // defaultValue={Object.keys(normalizedFilters.categories)}
                onValueChange={handleCategoryChange}
                placeholder="Select Categories"
            />


            {/* Language Filters */}
            <MultiSelect
                options={Object.keys(allFilters.languages).map((lang) => ({
                    label: `${lang} (${allFilters.languages[lang]})`,
                    value: lang,
                }))}
                value={Object.keys(formik.values.languages)}
                // defaultValue={Object.keys(normalizedFilters.languages)}
                onValueChange={handleLanguageChange}
                placeholder="Languages"
            />


            <Button type="submit" className="mt-2 cursor-pointer">
                Apply Filters
            </Button>
        </form>
    );
};

export default FilterGrid;
