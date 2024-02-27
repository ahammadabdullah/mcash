import axios from "axios";
import { logout } from "../lib/apis";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_baseURL,
  withCredentials: true,
});

// intercept response and check for unauthorized responses.
axiosSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("Error tracked in the interceptor", error.response);
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      await logout(localStorage.getItem("number"));
      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;
