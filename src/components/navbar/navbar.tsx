import {Link, useLocation, useNavigate} from "react-router";
import {useAppDispatch, useAppSelector} from "@/store/store.ts";
import {
    AUTHENTICATED_NAVBAR_PATHS,
    AUTHENTICATED_NAVBAR_PATHS_TYPE,
    UNAUTHENTICATED_NAVBAR_PATHS,
    UNAUTHENTICATED_NAVBAR_PATHS_TYPE
} from "@/constants.ts";
import {useEffect, useState} from "react";
import {logout} from "@/store/authSlice.ts";


const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [navbarItems, setNavbarItems] = useState<UNAUTHENTICATED_NAVBAR_PATHS_TYPE | AUTHENTICATED_NAVBAR_PATHS_TYPE>(UNAUTHENTICATED_NAVBAR_PATHS)

    const user = useAppSelector(state => state.user.user);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (user && user.userId) {
            setNavbarItems(AUTHENTICATED_NAVBAR_PATHS)
        } else {
            setNavbarItems(UNAUTHENTICATED_NAVBAR_PATHS)
        }
    }, [user]);


    return (
        <nav className="fixed top-0 left-0 flex w-full h-20 space-x-4 bg-[#030712] z-40">
            <div className="w-full flex justify-between items-center px-6">
                <div className="h-12">
                    <img className="h-full cursor-pointer" src="/logo-white-background-transparent.png" alt="Logo" onClick={() => navigate(UNAUTHENTICATED_NAVBAR_PATHS["Home"])} />
                </div>
                <div className="flex justify-center items-center gap-4">
                    {navbarItems && Object.entries(navbarItems).map(([label, path]) => (
                        <Link
                            key={label}
                            to={path}
                            onClick={() => label === "Logout" && dispatch(logout())}
                            className={`px-4 py-2 rounded ${
                                location.pathname === path ? "bg-blue-500 text-white" : "text-gray-700 duration-200 hover:bg-gray-200"
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;