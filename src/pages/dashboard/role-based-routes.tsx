import {DASHBOARD_NAVBAR_PATHS} from "@/constants.ts";
import ProtectedRoute from "@/utils/protected-route.tsx";
import {Route, Routes} from "react-router";
import Profile from "@/pages/dashboard/profile/profile.tsx";
import MyLoans from "@/pages/dashboard/my-loans/my-loans.tsx";
import MyReservations from "@/pages/dashboard/my-reservations/my-reservations.tsx";
import {Navigate} from "react-router-dom";
import AddResources from "@/pages/dashboard/add-resources/add-resources.tsx";


const RoleBasedRoutes = ({ userType }: { userType: string }) => {
    const commonRoutes = [
        <Route key="profile" path={DASHBOARD_NAVBAR_PATHS["Profile"].split("/")[2]} element={<Profile />} />,
        <Route key="loans" path={DASHBOARD_NAVBAR_PATHS["My Loans"].split("/")[2]} element={<MyLoans />} />,
        <Route key="reservations" path={DASHBOARD_NAVBAR_PATHS["My Reservations"].split("/")[2]} element={<MyReservations />} />,
    ];

    const adminRoutes = [
        <Route
            key="employee-management"
            path={DASHBOARD_NAVBAR_PATHS["Employee Management"].split("/")[2]}
            element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <div>Employee Management Page</div>
                </ProtectedRoute>
            }
        />,
    ];

    const librarianRoutes = [
        <Route
            key="add-resources"
            path={DASHBOARD_NAVBAR_PATHS["Add Resources"].split("/")[2]}
            element={
                <ProtectedRoute allowedRoles={["LIBRARIAN", "ADMIN"]}>
                    <AddResources />
                </ProtectedRoute>
            }
        />,
    ];

    const additionalRoutes =
        userType === "ADMIN"
            ? [...adminRoutes, ...librarianRoutes]
            : userType === "LIBRARIAN"
                ? librarianRoutes
                : [];

    return (
        <Routes>
            {commonRoutes}
            {additionalRoutes}
            <Route index element={<Navigate to={DASHBOARD_NAVBAR_PATHS["Profile"].split("/")[2]} replace />} />
        </Routes>
    );
};

export default RoleBasedRoutes;