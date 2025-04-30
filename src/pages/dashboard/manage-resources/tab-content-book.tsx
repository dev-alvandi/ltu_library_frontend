import BookForm from "@/pages/dashboard/manage-resources/_book/book-form.tsx";
import {RESOURCE_COPY_TYPES, RESOURCE_TYPES} from "@/pages/dashboard/type.ts";

interface Props {
    resourceType: RESOURCE_TYPES;
    resourceCopy: RESOURCE_COPY_TYPES;
}

const TabContentBook = ({ resourceType }: Props) => {

    return (
        <div className="mt-6 space-y-4">
            {(resourceType === "Book") && <BookForm />}
            {/*{(resourceType === "Film") && <FilmForm />}*/}
            {/*{(resourceType === "Magazine") && <MagazineForm />}*/}
        </div>
    );
};

export default TabContentBook;
