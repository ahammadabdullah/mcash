import { Navigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import Loading from "../Pages/Loading";

const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <Loading />;
  }
  if (user) {
    return <Navigate to="/" />;
  }
  return children;
};

export default AuthRoute;
