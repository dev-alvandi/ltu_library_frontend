import {Link, useLocation, useNavigate} from "react-router";
import {useAppSelector} from "@/store/store.ts";
import {
    AUTHENTICATED_NAVBAR_PATHS,
    AUTHENTICATED_NAVBAR_PATHS_TYPE,
    UNAUTHENTICATED_NAVBAR_PATHS,
    UNAUTHENTICATED_NAVBAR_PATHS_TYPE
} from "@/constants.ts";
import {useEffect, useState} from "react";
import {logout} from "@/store/Authentication/authSlice.ts";


const Navbar = () => {
    const auth = useAppSelector(state => state.auth);

    const [navbarItems, setNavbarItems] = useState<UNAUTHENTICATED_NAVBAR_PATHS_TYPE | AUTHENTICATED_NAVBAR_PATHS_TYPE>()

    useEffect(() => {
        if (auth.user && Object.keys(auth.user).length > 0) {
            setNavbarItems(AUTHENTICATED_NAVBAR_PATHS)
            console.log("Authenticated")
            console.log(auth.user)

        } else {
            setNavbarItems(UNAUTHENTICATED_NAVBAR_PATHS)
            console.log("Unauthenticated")
        }
    }, [auth, auth.user, auth.token])


    const location = useLocation();
    const navigate = useNavigate();

    return (
        <nav className="flex w-full h-20 space-x-4">
            <div className="w-full flex justify-between items-center px-6">
                <div className="h-12">
                    <img className="h-full cursor-pointer" src="/logo-white-background-transparent.png" alt="Logo" onClick={() => navigate(UNAUTHENTICATED_NAVBAR_PATHS["Home"])} />
                </div>
                <div className="flex justify-center items-center gap-4">
                    {navbarItems && Object.entries(navbarItems).map(([label, path]) => (
                        <Link
                            key={label}
                            to={path}
                            onClick={() => label === "Logout" && logout()}
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