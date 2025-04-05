import './App.css'
import {Route, Routes} from "react-router";
import Authentication from "@/pages/Authentication/Authentication.tsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {

    return (
        <>
            <Routes>
                <Route path="/auth" element={<Authentication/>}/>
            </Routes>
            <ToastContainer position="top-right" autoClose={3000}/>
        </>
    )
}

export default App
