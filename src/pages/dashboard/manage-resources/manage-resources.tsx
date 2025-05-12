import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs";
import {useState} from "react";
import TabContentBook from "@/pages/dashboard/manage-resources/tab-content-book";
import {Separator} from "@/components/ui/separator.tsx";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {FormEvent, useState as useLocalState} from "react";
import {useAppDispatch} from "@/store/store.ts";
import {returnResource} from "@/store/user-slice.ts";
import {toast} from "react-toastify";


const ManageResources = () => {
    const dispatch = useAppDispatch();

    const [activeTab, setActiveTab] = useState("book");
    const [barcode, setBarcode] = useLocalState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log("Returning resource with barcode:", barcode);
        // Add return logic here
        const result = await dispatch(returnResource(barcode))

        if (returnResource.fulfilled.match(result)) {
            toast.success("Resource returned successfully")
        } else {
            toast.error("Something went wrong during returning resource")
        }

    };

    return (
        <div className="px-6 space-y-6">
            <>
                <h2 className="text-xl font-semibold text-white">Add Resource Management</h2>
                <Tabs className="pb-6" value={activeTab} onValueChange={setActiveTab}>
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
                        <TabContentBook resourceType="Book" resourceCopy="Book Copy"/>
                    </TabsContent>

                    <TabsContent value="film">
                        <p className="text-muted-foreground">Film form coming soon...</p>
                    </TabsContent>

                    <TabsContent value="magazine">
                        <p className="text-muted-foreground">Magazine form coming soon...</p>
                    </TabsContent>
                </Tabs>
            </>

            <Separator/>

            <>
                <h2 className="text-xl font-semibold text-white">Return Resource Management</h2>
                <form onSubmit={handleSubmit} className="space-y-4 flex justify-between items-center gap-6">
                    <div className="flex flex-col gap-2 flex-grow">
                        <Label htmlFor="barcode">Barcode</Label>
                        <Input
                            id="barcode"
                            value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}
                            placeholder="Enter or scan barcode"
                            className="bg-[#2c2c2f] text-white px-3 py-6"
                        />
                    </div>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Return Resource
                    </Button>
                </form>
            </>
        </div>
    );
};

export default ManageResources;
