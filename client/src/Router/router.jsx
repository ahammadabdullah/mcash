import React from "react";

import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import Login from "../Pages/Login/Login";
import Home from "../Pages/Home/Home";
import Dashboard from "../Layouts/Dashboard";
import Register from "../Pages/Register/Register";
import Profile from "../Pages/Dashboard/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "",
        element: <Profile />,
      },
      {
        path: "settings",
        element: <div>Dashboard Settings</div>,
      },
    ],
  },
]);

export default router;
