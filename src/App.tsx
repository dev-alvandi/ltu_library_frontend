import './App.css'
import {Route, Routes, useNavigate} from "react-router";
import Authentication from "@/pages/auth/authentication.tsx";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import RequestPasswordReset from "@/pages/auth/password-reset/requestPasswordReset.tsx";
import PasswordReset from "@/pages/auth/password-reset/passwordReset.tsx";
import Layout from "@/pages/layout.tsx";
import Home from "@/pages/home/home.tsx";
import Contact from "@/pages/contact/contact.tsx";
import {ALL_POSSIBLE_RESOURCES, AUTHENTICATED_NAVBAR_PATHS, UNAUTHENTICATED_NAVBAR_PATHS} from "@/constants.ts";
import {useAppDispatch} from "@/store/store.ts";
import SearchBookResources from "@/pages/_resources/books/search-book-resources.tsx";
import Dashboard from "@/pages/dashboard/dashboard.tsx";
import {useEffect, useState} from "react";
import {isJwtTokenValid} from "@/store/auth-slice.ts";
import Loading from "@/components/loading.tsx";
import ProtectedRoute from "@/utils/protected-route.tsx";
import ManageResources from "@/pages/manage-resources/manage-resources.tsx";

function App() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)

    const dispatch = useAppDispatch();

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await dispatch(isJwtTokenValid())
                if (response.payload) {
                    return;
                }
                navigate("/auth");
                toast.error("Your session was invalid or expired")
            }
        }

        setLoading(false)

        verifyToken();
    }, [dispatch, navigate])

    if (loading) {
        return <Loading />
    }

    return (
        <>
            <Routes>
                <Route path="auth" element={<Authentication/>}/>
                <Route path="auth/password-reset" element={<RequestPasswordReset/>}/>
                <Route path="auth/password-reset/:token" element={<PasswordReset/>}/>

                <Route path={UNAUTHENTICATED_NAVBAR_PATHS["Home"]} element={<Layout/>}>
                    <Route index element={<Home/>}/>
                    <Route path={UNAUTHENTICATED_NAVBAR_PATHS["Contact Us"]} element={<Contact/>}/>
                    <Route path={UNAUTHENTICATED_NAVBAR_PATHS["Books"]} element={<SearchBookResources resource={ALL_POSSIBLE_RESOURCES["books"]}/>}/>
                    <Route path={UNAUTHENTICATED_NAVBAR_PATHS["Films"]} element={<SearchBookResources resource={ALL_POSSIBLE_RESOURCES["films"]} />}/>
                    <Route path={UNAUTHENTICATED_NAVBAR_PATHS["Magazines"]} element={<SearchBookResources resource={ALL_POSSIBLE_RESOURCES["magazines"]} />}/>
                    <Route path={`${AUTHENTICATED_NAVBAR_PATHS["Dashboard"]}/*`} element={
                        <ProtectedRoute
                            allowedRoles={["LIBRARIAN", "ADMIN", "STUDENT", "UNIVERSITY STAFF", "PUBLIC"]}>
                                <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path={`/manage-resources/*`} element={
                        <ProtectedRoute
                            allowedRoles={["LIBRARIAN", "ADMIN"]}>
                                <ManageResources />
                        </ProtectedRoute>
                    } />
                </Route>
            </Routes>
            <ToastContainer position="top-right" autoClose={3000}/>
        </>
    )
}

export default App
