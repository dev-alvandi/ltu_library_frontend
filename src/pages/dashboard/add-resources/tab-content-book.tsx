import { Button } from "@/components/ui/button";
import { useState } from "react";
import BookForm from "@/pages/dashboard/add-resources/_book/book-form.tsx";
import BookCopyForm from "@/pages/dashboard/add-resources/_book/book-copy-form.tsx";
import { cn } from "@/lib/utils.ts";
import {RESOURCE_COPY_TYPES, RESOURCE_TYPES} from "@/pages/dashboard/type.ts";

interface Props {
    resourceType: RESOURCE_TYPES;
    resourceCopy: RESOURCE_COPY_TYPES;
}

const TabContentBook = ({resourceType, resourceCopy}: Props) => {
    const [isNewBook, setIsNewBook] = useState(true);

    return (
        <div className="mt-6 space-y-4">
            <div className="flex gap-2">
                <Button
                    onClick={() => setIsNewBook(true)}
                    className={cn(
                        "rounded-md px-4 py-2 font-medium duration-300 transition-colors",
                        isNewBook
                            ? "bg-(--color-blue-theme) text-white hover:bg-(--color-blue-theme)"
                            : "bg-white/70 text-black hover:bg-gray-300"
                    )}
                >
                    New {resourceType}
                </Button>
                <Button
                    onClick={() => setIsNewBook(false)}
                    className={cn(
                        "rounded-md px-4 py-2 font-medium transition-colors",
                        !isNewBook
                            ? "bg-(--color-blue-theme) text-white hover:bg-(--color-blue-theme)"
                            : "bg-white/70 text-black hover:bg-gray-300"
                    )}
                >
                    {resourceCopy}
                </Button>
            </div>

            {(isNewBook && resourceType === "Book") ? <BookForm /> : <BookCopyForm />}
            {/*{(isNewBook && resourceType === "Film") ? <FilmForm /> : <FilmCopyForm />}*/}
            {/*{(isNewBook && resourceType === "Magazine") ? <MagazineForm /> : <MagazineCopyForm />}*/}
        </div>
    );
};

export default TabContentBook;
