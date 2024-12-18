import React, { useContext} from "react";
import { Context } from "./store/appContext";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { RegisterUser } from "./pages/regiterUser"
import { LoginUser } from "./pages/loginUser"
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import { DetailTrip } from "./pages/detailTrip";
import { BuyTrip } from "./pages/buyTrip";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

import { PerfilAdmin } from "./component/perfiladmin";
import { PerfilUser } from "./pages/userinfo";
import { ChangePassword } from "./pages/changepassword";

//create your first component
const Layout = () => {
    const {store} = useContext(Context);
    const {currentUser} = store; 
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";


    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={currentUser?.is_admin ? <PerfilAdmin /> : <Navigate to="/" />  } path="/perfiladmin" />
                        <Route element={<Home />} path="/" />
                        <Route element={<RegisterUser />} path="/register" />
                        <Route element={<DetailTrip />} path="/plans/:planId" />
                        <Route element={<BuyTrip />} path="/buyTrip/:planId" />
                        <Route element={<LoginUser />} path="/loginuser" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<PerfilUser />} path="/userinfo" />
                        <Route element={<ChangePassword />} path="/changepassword" />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
