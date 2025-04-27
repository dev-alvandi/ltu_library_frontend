import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import TabContentBook from "@/pages/dashboard/add-resources/tab-content-book";

const AddResources = () => {
    const [activeTab, setActiveTab] = useState("book");

    return (
        <div className="p-6 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start gap-4 border border-gray-700 bg-white/70 rounded-md p-1">
                    <TabsTrigger
                        value="book"
                        className="cursor-pointer data-[state=active]:bg-(--color-blue-theme) data-[state=active]:text-white duration-300 transition-colors hover:bg-gray-300 rounded-md px-4 py-2"
                    >
                        Book
                    </TabsTrigger>
                    <TabsTrigger
                        value="film"
                        className="cursor-pointer data-[state=active]:bg-(--color-blue-theme) data-[state=active]:text-white duration-300 transition-colors hover:bg-gray-300 rounded-md px-4 py-2"
                    >
                        Film
                    </TabsTrigger>
                    <TabsTrigger
                        value="magazine"
                        className="cursor-pointer data-[state=active]:bg-(--color-blue-theme) data-[state=active]:text-white duration-300 transition-colors hover:bg-gray-300 rounded-md px-4 py-2"
                    >
                        Magazine
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="book">
                    <TabContentBook resourceType="Book" resourceCopy="Book Copy" />
                </TabsContent>

                <TabsContent value="film">
                    <p className="text-muted-foreground">Film form coming soon...</p>
                </TabsContent>

                <TabsContent value="magazine">
                    <p className="text-muted-foreground">Magazine form coming soon...</p>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AddResources;
