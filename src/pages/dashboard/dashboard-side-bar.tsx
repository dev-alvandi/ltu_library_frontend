import { NavLink } from "react-router-dom";
import { DASHBOARD_NAVBAR_PATHS } from "@/constants.ts";

const DashboardSideBar = () => {
    return (
        <div className="lg:w-64 w-full h-full text-white">
            <div className="flex flex-col w-full gap-4">
                {
                    Object.entries(DASHBOARD_NAVBAR_PATHS).map(([label, path]) => (
                        <NavLink
                            to={path}
                            key={label}
                            className={({ isActive }) =>
                                `pl-8 py-3 rounded transition-colors duration-200 ${
                                    isActive ? "bg-white text-black font-semibold" : "hover:bg-neutral-800"
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))
                }
            </div>
        </div>
    );
};

export default DashboardSideBar;
