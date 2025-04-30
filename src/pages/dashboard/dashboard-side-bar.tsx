import {NavLink} from "react-router-dom";
import {DASHBOARD_NAVBAR_PATHS} from "@/constants.ts";

const DashboardSideBar = ({userType}: { userType: string }) => {
    // Define access control per route
    const SIDEBAR_LINKS = [
        {label: "Profile", path: DASHBOARD_NAVBAR_PATHS["Profile"], roles: ["STUDENT", "LIBRARIAN", "ADMIN", "UNIVERSITY STAFF", "PUBLIC"]},
        {label: "My Loans", path: DASHBOARD_NAVBAR_PATHS["My Loans"], roles: ["STUDENT", "LIBRARIAN", "ADMIN", "UNIVERSITY STAFF", "PUBLIC"]},
        {
            label: "My Reservations",
            path: DASHBOARD_NAVBAR_PATHS["My Reservations"],
            roles: ["STUDENT", "LIBRARIAN", "ADMIN", "UNIVERSITY STAFF", "PUBLIC"]
        },
        {label: "Add Resources", path: DASHBOARD_NAVBAR_PATHS["Add Resources"], roles: ["LIBRARIAN", "ADMIN"]},
        // {label: "Employee Management", path: DASHBOARD_NAVBAR_PATHS["Employee Management"], roles: ["ADMIN"]},
    ];

    // Filter based on role
    const visibleLinks = SIDEBAR_LINKS.filter((link) =>
        link.roles.includes(userType)
    );

    return (
        <div className="lg:w-64 w-full h-full text-white">
            <div className="flex flex-col w-full gap-4">
                {visibleLinks.map(({label, path}) => (
                    <NavLink
                        to={path}
                        key={label}
                        className={({isActive}) =>
                            `pl-8 py-3 rounded transition-colors duration-200 ${
                                isActive ? "bg-white text-black font-semibold" : "hover:bg-neutral-800"
                            }`
                        }
                    >
                        {label}
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default DashboardSideBar;
