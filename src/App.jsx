import React from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Auth from "./Components/Authentication/Auth.jsx";
import "./App.css";
import Verify from "./Components/Authentication/Verify.jsx";
import Dashboard from "./Components/Dashboard/Dashboard.jsx";
import NoPageFound from "./Components/NoPage/NoPageFound.jsx";
import LoadingProvider from "./Components/Context/contextLoading.jsx";

export default function App(props) {
    const [deferredPrompt, setDeferredPrompt] = React.useState(null);
    const [canInstall, setCanInstall] = React.useState(false);

    React.useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setCanInstall(true);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        setDeferredPrompt(null);
        setCanInstall(false);
    };

    return (
            <LoadingProvider>
                {canInstall && (
                    <div className="fixed bottom-4 right-4 z-50">
                        <button
                            onClick={handleInstallClick}
                            className="bg-cyan-700 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold hover:bg-cyan-800 transition"
                        >
                            Install GenInvoice
                        </button>
                    </div>
                )}
                <BrowserRouter>
                    <Routes>
                        <Route index element={<Auth/>} />
                        <Route exact path="/verify" element={<Verify/>} />
                        <Route exact path="/dashboard/*" element={<Dashboard data={props.loading} />}/>
                        <Route exact path="*" element={<NoPageFound/>}/>
                    </Routes>
                </BrowserRouter>
            </LoadingProvider>
    )
}
