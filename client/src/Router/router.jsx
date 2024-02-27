import React from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import Login from "../Pages/Login/Login";
import Home from "../Pages/Home/Home";
import Dashboard from "../Layouts/Dashboard";
import Register from "../Pages/Register/Register";
import Profile from "../Pages/Dashboard/Profile";
import Requests from "../Pages/Dashboard/Requests";
import Users from "../Pages/Dashboard/Users";
import UserTransactions from "../Pages/Dashboard/UserTransactions";
import Error from "../Pages/Error";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import AuthRoute from "../PrivateRoute/AuthRoute";

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
        element: (
          <AuthRoute>
            <Login />
          </AuthRoute>
        ),
      },
      {
        path: "/register",
        element: (
          <AuthRoute>
            <Register />
          </AuthRoute>
        ),
      },
    ],
    errorElement: <Error />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <Profile />,
      },
      {
        path: "requests",
        element: <Requests />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "userTransactions/:number",
        element: <UserTransactions />,
      },
    ],
    errorElement: <Error />,
  },
]);

export default router;
