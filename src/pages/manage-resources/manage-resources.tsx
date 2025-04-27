import { useParams } from "react-router";
import BookManage from "@/pages/manage-resources/_book/book-manage.tsx";

const ManageResources = () => {
    const { '*': path } = useParams();
    const [resourceType, id] = path?.split("/") || [];

    const renderResourceManager = () => {
        switch (resourceType) {
            case "books":
                return <BookManage id={id} />;
            // case "films":
            //     return <FilmManage id={id} />;
            // case "magazines":
            //     return <MagazineManage id={id} />;
            default:
                return <div>Unknown resource type</div>;
        }
    };

    console.log(resourceType)

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {renderResourceManager()}
        </div>
    );
};

export default ManageResources;
