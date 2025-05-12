import { useAppSelector } from "@/store/store.ts";
import { Navigate, useLocation } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DASHBOARD_NAVBAR_PATHS } from "@/constants.ts";
import {User} from "@/types/entitiesType.ts";

type ProtectedRouteProps = {
    allowedRoles: User["userType"][];
    children: ReactNode;
};

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
    const userType = useAppSelector((state) => state.auth.user?.userType);
    const location = useLocation();
    const [wasDenied, setWasDenied] = useState(false);

    const isValidUserRole = (role: string): role is User["userType"] => {
        return ["ADMIN", "LIBRARIAN", "STUDENT", "RESEARCHER", "UNIVERSITY STAFF", "PUBLIC"].includes(role);
    };

    console.log(userType);

// Usage
    useEffect(() => {
        if (userType && isValidUserRole(userType) && !allowedRoles.includes(userType) && !wasDenied) {
            toast.info("You are not authorized to access that page.");
            setWasDenied(true);
        }
    }, [userType, allowedRoles, wasDenied]);

    if (userType && isValidUserRole(userType) && !allowedRoles.includes(userType)) {
        return <Navigate to={DASHBOARD_NAVBAR_PATHS["Profile"]} state={{ from: location }} replace />;
    }


    return <>{children}</>;
};

export default ProtectedRoute;
