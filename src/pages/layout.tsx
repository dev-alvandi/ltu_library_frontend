import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar.tsx";
import Footer from "@/components/footer.tsx";

const Layout = () => {
    return (
        <div className="">
            <Navbar />

            <main className="flex-1">
                <div className="max-w-[1300px] w-full m-auto pt-20">
                    <Outlet />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Layout;

