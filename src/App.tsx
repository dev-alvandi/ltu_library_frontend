import './App.css'
import {Route, Routes} from "react-router";
import Authentication from "@/pages/auth/Authentication.tsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import RequestPasswordReset from "@/pages/auth/password-reset/RequestPasswordReset.tsx";
import PasswordReset from "@/pages/auth/password-reset/PasswordReset.tsx";

function App() {

    return (
        <>
            <Routes>
                <Route path="auth" element={<Authentication />} />
                <Route path="auth/password-reset" element={<RequestPasswordReset />} />
                <Route path="auth/password-reset/:token" element={<PasswordReset />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000}/>
        </>
    )
}

export default App
