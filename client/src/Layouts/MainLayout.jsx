import { Outlet } from "react-router-dom";
import NavBar from "../Components/NavBar";
const MainLayout = () => {
  return (
    <div
      className="bg-cover h-screen "
      style={{
        backgroundImage: "url(/banner.jpg)",
      }}
    >
      <NavBar />
      <div
        className="flex justify-end items-center"
        style={{ height: "calc(100vh - 50px)" }}
      >
        <div className="lg:w-[40%] w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
