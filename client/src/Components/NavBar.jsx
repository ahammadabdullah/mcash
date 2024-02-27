import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

const NavBar = () => {
  const location = useLocation();
  const { user } = useAuth();
  return (
    <div className="flex justify-center items-center gap-6 h-[50px] text-white">
      <NavLink
        className={
          location.pathname === "/" ? " border-b-2  border-b-teal-700 " : ""
        }
        to="/"
      >
        Home
      </NavLink>
      {!user && (
        <NavLink
          className={
            location.pathname === "/login"
              ? " border-b-2  border-b-teal-700 "
              : ""
          }
          to="/login"
        >
          Login
        </NavLink>
      )}
      {user && (
        <NavLink
          className={
            location.pathname === "/dashboard"
              ? " border-b-2  border-b-teal-700 "
              : ""
          }
          to="/dashboard"
        >
          Dashboard
        </NavLink>
      )}
    </div>
  );
};

export default NavBar;
