import React from "react";
import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import Home from "./pages/home/Home";
import Details from "./pages/details/Details";
import SearchResult from "./pages/searchResult/SearchResult";
import Explore from "./pages/explore/Explore";
import Bookmarks from "./pages/bookmarks/Bookmarks";
import PageNotFound from "./pages/404/PageNotFound";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import Request from "./pages/auth/forgot-password/reequest/Request";
import Change from "./pages/auth/forgot-password/change/Change";
import VerifyEmail from "./pages/auth/verifyEmail/VerifyEmail";
import AuthLayout from "./layouts/AuthLayout";
import RootLayout from "./layouts/RootLayout";
import "./index.css";

axios.defaults.baseURL = `${import.meta.env.VITE_APP_SERVER_URL}/api`;

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={<RootLayout />}>
                <Route path="/" element={<Home />} />
                <Route
                    path="/:mediaType/:name/:id/:season_num/:episode_num"
                    element={<Details />}
                />
                <Route path="/search/:query" element={<SearchResult />} />
                <Route path="/explore/:mediaType" element={<Explore />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/bookmarks" element={<Bookmarks />} />
                </Route>
                <Route path="*" element={<PageNotFound />} />
            </Route>

            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password/request" element={<Request />} />
                <Route path="/forgot-password/change" element={<Change />} />
            </Route>

            <Route path="/verifyEmail" element={<VerifyEmail />} />
        </>
    )
);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
        <Toaster />
    </React.StrictMode>
);
