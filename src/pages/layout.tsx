import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar/navbar.tsx";

const Layout = () => {
    return (
        <div>
            <Navbar />
            <main className="mt-20">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;