import { Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/store/store";
import {JSX, useEffect, useState} from "react";
import { isJwtTokenValid } from "@/store/authSlice";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const token = localStorage.getItem("token");

    const [checking, setChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setIsAuthenticated(false);
                setChecking(false);
                return;
            }

            const res = await dispatch(isJwtTokenValid());

            if (res.payload) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
            setChecking(false);
        };

        validateToken();
    }, [dispatch, token]);

    if (checking) return null; // Or render a loader/spinner here

    if (!isAuthenticated || !user || Object.keys(user).length === 0) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

export default ProtectedRoute;
