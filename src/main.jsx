import React, { useEffect, useContext } from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter, Route,
    RouterProvider, Routes,
    Navigate,
} from "react-router-dom";
import Root from './routes/root';
import TransList from './routes/TranList.jsx';
import './index.css'
import {BrowserRouter} from 'react-router-dom';
import {AuthProvider, AuthContext} from './routes/AuthContext.jsx';
import Layout from "./routes/layout.jsx";
import Ntunhssu  from "./routes/ntunhssu.jsx";
const App = () => {
    const authContext = useContext(AuthContext);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch('/api/check-auth');
                const data = await response.json();
                if (data.loggedIn) {
                    authContext.updateLoggedInStatus(true);
                }
            } catch (error) {
                console.error('Error checking auth:', error);
            }
        };

        checkAuthStatus();
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/root"/>}/>
                <Route path="/root" element={<Root/>}/>
                <Route path="/ntunhssu" element={<Layout><Ntunhssu /></Layout>}/>
                <Route path="/TranList" element={<Layout><TransList /></Layout>} />
            </Routes>
        </BrowserRouter>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
