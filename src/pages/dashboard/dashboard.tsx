import DashboardSideBar from "@/pages/dashboard/dashboard-side-bar.tsx";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet.tsx";
import {Button} from "@/components/ui/button.tsx";
import {SlidersHorizontal} from "lucide-react";
import {Route, Routes} from "react-router";
import Profile from "@/pages/dashboard/profile/profile.tsx";
import MyLoans from "@/pages/dashboard/my-loans/my-loans.tsx";
import MyReservations from "@/pages/dashboard/my-reservations/my-reservations.tsx";
import {Navigate} from "react-router-dom";
import {DASHBOARD_NAVBAR_PATHS} from "@/constants.ts";

const Dashboard = () => {
    return (
        <div className="grid grid-cols-12 h-[calc(100vh-5rem)]">
            {/* Desktop Static Sidebar */}
            <div className="hidden lg:block col-span-3">
                <div className="sticky top-20 h-[calc(100vh-6rem)] overflow-auto pr-2">
                    <DashboardSideBar />
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
                                    <DashboardSideBar />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
                {/*<Separator />*/}
                <Routes>
                    <Route path={DASHBOARD_NAVBAR_PATHS["Profile"].split("/")[2]} element={<Profile />} />
                    <Route path={DASHBOARD_NAVBAR_PATHS["My Loans"].split("/")[2]} element={<MyLoans />} />
                    <Route path={DASHBOARD_NAVBAR_PATHS["My Reservations"].split("/")[2]} element={<MyReservations />} />
                    <Route index element={<Navigate to={DASHBOARD_NAVBAR_PATHS["Profile"].split("/")[2]} replace />} /> {/* Optional default */}
                </Routes>
            </div>
        </div>
    );
};

export default Dashboard;