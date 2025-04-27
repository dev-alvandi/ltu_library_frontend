import DashboardSideBar from "@/pages/dashboard/dashboard-side-bar.tsx";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet.tsx";
import {Button} from "@/components/ui/button.tsx";
import {SlidersHorizontal} from "lucide-react";
import {useAppSelector} from "@/store/store.ts";
import RoleBasedRoutes from "@/pages/dashboard/role-based-routes.tsx";

const Dashboard = () => {
    const user = useAppSelector((state) => state.auth.user);

    console.log(user)

    return (
        <div className="grid grid-cols-12 h-[calc(100vh-5rem)]">
            {/* Desktop Static Sidebar */}
            <div className="hidden lg:block col-span-3">
                <div className="sticky top-20 h-[calc(100vh-6rem)] overflow-auto pr-2">
                    {user && <DashboardSideBar userType={user.userType} />}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="col-span-12 px-6 md:col-span-12 md:px-12 lg:col-span-9 lg:px-0 pt-4">
                <div className="sticky top-20 w-full flex justify-between items-center bg-[#030712] z-20 border border-transparent">
                    {/* Mobile Filter Button + Sheet */}
                    <div className="lg:hidden mb-4 px-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="default">
                                    <SlidersHorizontal />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-72 sm:w-80 bg-[#030712]">
                                <SheetHeader>
                                    <SheetTitle className="text-white">Dashboard Menu</SheetTitle>
                                </SheetHeader>
                                <div className="mt-4">
                                    {user && <DashboardSideBar userType={user.userType} />}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
                {/*<Separator />*/}

                {user && <RoleBasedRoutes userType={user.userType} />}
            </div>
        </div>
    );
};

export default Dashboard;