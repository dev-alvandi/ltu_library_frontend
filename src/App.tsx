import './App.css'
import {Route, Routes} from "react-router";
import Authentication from "@/pages/auth/authentication.tsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import RequestPasswordReset from "@/pages/auth/password-reset/requestPasswordReset.tsx";
import PasswordReset from "@/pages/auth/password-reset/passwordReset.tsx";
import Layout from "@/pages/layout.tsx";
import Home from "@/pages/home/home.tsx";
import Contact from "@/pages/contact/contact.tsx";
import {UNAUTHENTICATED_NAVBAR_PATHS} from "@/constants.ts";

function App() {

    return (
        <>
            <Routes>
                <Route path="auth" element={<Authentication/>}/>
                <Route path="auth/password-reset" element={<RequestPasswordReset/>}/>
                <Route path="auth/password-reset/:token" element={<PasswordReset/>}/>

                <Route path={UNAUTHENTICATED_NAVBAR_PATHS["Home"]} element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path={UNAUTHENTICATED_NAVBAR_PATHS["Contact Us"]} element={<Contact />} />
                    {/*<Route path="" element={< />}/>*/}
                </Route>
            </Routes>
            <ToastContainer position="top-right" autoClose={3000}/>
        </>
    )
}

export default App
