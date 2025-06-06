import {Link, useLocation, useNavigate} from "react-router";
import {useAppDispatch, useAppSelector} from "@/store/store.ts";
import {
    AUTHENTICATED_NAVBAR_PATHS,
    AUTHENTICATED_NAVBAR_PATHS_TYPE,
    UNAUTHENTICATED_NAVBAR_PATHS,
    UNAUTHENTICATED_NAVBAR_PATHS_TYPE,
} from "@/constants.ts";
import {useEffect, useState} from "react";
import {logout} from "@/store/auth-slice.ts";
import {Button} from "@/components/ui/button.tsx";
import {Menu} from "lucide-react";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet.tsx";
import {toast} from "react-toastify";
import {cn} from "@/lib/utils.ts";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();

    const [navbarItems, setNavbarItems] = useState<
        UNAUTHENTICATED_NAVBAR_PATHS_TYPE | AUTHENTICATED_NAVBAR_PATHS_TYPE
    >(UNAUTHENTICATED_NAVBAR_PATHS);

    useEffect(() => {
        if (user && user.userId) {
            setNavbarItems(AUTHENTICATED_NAVBAR_PATHS);
        } else {
            setNavbarItems(UNAUTHENTICATED_NAVBAR_PATHS);
        }
    }, [user]);

    const handleLogout = (label: string) => {
        if (label === "Logout") {
            dispatch(logout());
            toast.success("You are logged out.")
        }
    }

    return (
        <nav className="fixed top-0 left-0 flex w-full h-20 items-center bg-[#030712] z-40 px-6">
            <div className="flex items-center justify-between w-full max-w-[1300px] m-auto">
                <img
                    className="h-12 cursor-pointer"
                    src="/logo-white-background-transparent.png"
                    alt="Logo"
                    onClick={() => navigate(UNAUTHENTICATED_NAVBAR_PATHS["Home"])}
                />

                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-4">
                    {navbarItems &&
                        Object.entries(navbarItems).map(([label, path]) => (
                            <Link
                                data-testid={`navbar-${label.toLowerCase()}`}
                                key={label}
                                to={path}
                                onClick={() => label === "Logout" && dispatch(logout())}
                                className={
                                cn("/" + location.pathname.split("/")[1] === path ? "bg-blue-500 text-white" : "text-gray-300 hover:bg-gray-700",
                                    "lg:px-4 lg:py-2 px-2 py-1 rounded text-sm whitespace-nowrap font-medium transition-all duration-200")}
                            >
                                {label}
                            </Link>
                        ))}
                </div>

                {/* Mobile Navigation with Sheet */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="text-white"/>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-[#030712] text-white w-64 border-0">
                            <SheetHeader>
                                <SheetTitle className="text-left">Menu</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-2 mt-4">
                                <div className="w-full flex justify-center pb-6">
                                    <img
                                        className="h-12 cursor-pointer"
                                        src="/logo-white-background-transparent.png"
                                        alt="Logo"
                                        onClick={() => navigate(UNAUTHENTICATED_NAVBAR_PATHS["Home"])}
                                    />
                                </div>
                                {navbarItems &&
                                    Object.entries(navbarItems).map(([label, path]) => (
                                        <Link
                                            key={label}
                                            to={path}
                                            onClick={handleLogout.bind(null, label)}
                                            className={`block px-4 py-2 rounded text-sm font-medium transition-all duration-200
                      ${location.pathname === path ? "bg-blue-500 text-white" : "text-gray-300 hover:bg-gray-700"}`}
                                        >
                                            {label}
                                        </Link>
                                    ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;