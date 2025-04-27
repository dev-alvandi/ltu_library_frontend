import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar.tsx";

const Layout = () => {
    return (
        <div className="max-w-[1300px] m-auto">
            <Navbar />
            <main className="mt-20">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;