import { createContext, useEffect, useState } from "react";
import useAxiosPublic from "../Hooks/useAxiosPublic.jsx";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  const loginWithNumber = async (loginInfo) => {
    try {
      const res = await axiosPublic.put("/login", loginInfo);
      if (res.status === 200) {
        const uData = await axiosPublic.get(`/users/${loginInfo.number}`);
        localStorage.setItem("number", loginInfo.number);
        setUser(uData.data);
        setLoading(false);
      }
      return res.data;
    } catch (err) {
      return err;
    }
  };
  const logout = async (number) => {
    try {
      const res = await axiosPublic.put("/logout", { number });
      if (res.data.success === true) {
        setUser(null);
        localStorage.removeItem("number");
      }
      return res.data;
    } catch (err) {
      return err;
    }
  };
  const registerWithNumber = async (userData) => {
    try {
      const res = await axiosPublic.post("/register", userData);
      if (res.status === 200) {
        const uData = await axiosPublic.get(`/users/${userData?.number}`);
        localStorage.setItem("number", userData.number);
        setUser(uData.data);
        setLoading(false);
      }
      return res.data;
    } catch (err) {
      return err;
    }
  };
  useEffect(() => {
    const number = localStorage.getItem("number");
    if (number) {
      const checkUser = async () => {
        const userData = await axiosPublic.get(`/users/${number}`);
        setUser(userData.data);
        setLoading(false);
      };
      checkUser();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);
  const value = {
    loginWithNumber,
    logout,
    registerWithNumber,
    user,
    loading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
