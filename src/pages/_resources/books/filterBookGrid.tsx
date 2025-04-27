import {useFormik} from "formik";
import {z} from "zod";
import {toFormikValidationSchema} from "zod-formik-adapter";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {MultiSelect} from "@/components/ui/multi-select.tsx";
import {FILTERS_TYPE} from "./type.ts";
import {ALL_POSSIBLE_RESOURCES} from "@/constants.ts";
import {useEffect, useRef, useState} from "react";

const filterSchema = z.object({
    isAvailable: z.boolean(),
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

const FilterBookGrid = ({
                            allFilters,
                            setUserFilters,
                            resourceName,
                        }: Props) => {

    const [selectedCategories, setSelectedCategories] = useState<string[]>(Object.keys(allFilters.categories));
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(Object.keys(allFilters.languages));

    const isFirstRender = useRef(true);

    const formik = useFormik<FilterFormType>({
        initialValues: allFilters,
        enableReinitialize: true,
        validationSchema: toFormikValidationSchema(filterSchema),
        onSubmit: (values) => {
            setUserFilters(values);
        },
    });

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const updated = selectedCategories.reduce((acc, key) => {
            if (allFilters.categories[key] !== undefined) {
                acc[key] = allFilters.categories[key];
            }
            return acc;
        }, {} as Record<string, number>);

        formik.setFieldValue("categories", updated);
    }, [selectedCategories]);

    useEffect(() => {
        if (isFirstRender.current) return;

        const updated = selectedLanguages.reduce((acc, key) => {
            if (allFilters.languages[key] !== undefined) {
                acc[key] = allFilters.languages[key];
            }
            return acc;
        }, {} as Record<string, number>);

        formik.setFieldValue("languages", updated);
    }, [selectedLanguages]);


    return (
        <form onSubmit={formik.handleSubmit} className="h-full relative flex flex-col px-4 gap-5">
            <h2 className="text-lg font-semibold text-black lg:text-white">Filters</h2>

            {/* Availabilities */}
            {resourceName !== ALL_POSSIBLE_RESOURCES["magazines"] && (
                <label className="flex items-center gap-2 text-black lg:text-white">
                    <Checkbox
                        checked={formik.values.isAvailable}
                        onCheckedChange={(checked) => formik.setFieldValue("isAvailable", checked)}
                    />
                    Available to Borrow
                </label>
            )}

            {/* Year Range */}
            <div className="flex gap-2 text-black lg:text-white">
                <Input
                    type="number"
                    name="minYear"
                    placeholder="From Year"
                    value={formik.values.minYear}
                    onChange={formik.handleChange}
                    min={formik.values.minYear}
                    max={formik.values.maxYear}
                />
                <Input
                    type="number"
                    name="maxYear"
                    placeholder="To Year"
                    value={formik.values.maxYear}
                    onChange={formik.handleChange}
                    min={formik.values.minYear}
                    max={formik.values.maxYear}
                />
            </div>

            {
                formik.values && (
                    <>
                        {/* Categories */}
                        <MultiSelect
                            options={Object.keys(allFilters.categories).map((cat) => ({
                                label: `${cat} (${allFilters.categories[cat]})`,
                                value: cat,
                            }))}
                            value={selectedCategories}
                            onValueChange={setSelectedCategories}
                            placeholder="Select Categories"
                        />

                        {/* Language Filters */}
                        <MultiSelect
                            options={Object.keys(allFilters.languages).map((lang) => ({
                                label: `${lang} (${allFilters.languages[lang]})`,
                                value: lang,
                            }))}
                            value={selectedLanguages}
                            onValueChange={setSelectedLanguages}
                            placeholder="Languages"
                        />
                    </>
                )
            }


            <Button type="submit" className="w-full relative h-12 overflow-hidden group text-white font-semibold cursor-pointer">
                Apply Filters
            </Button>
        </form>
    );
};

export default FilterBookGrid;
