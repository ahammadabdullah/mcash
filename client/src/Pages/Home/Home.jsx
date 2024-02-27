import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-start gap-5 p-10">
      <h3 className="text-3xl md:text-4xl lg:text-5xl">
        Manage your money on the go, securely and easily.
      </h3>
      <p className="text-xl md:text-2xl">
        Experience the future of financial transactions with our innovative
        platform.
      </p>
      <Link
        to={"/register"}
        className="bg-teal-700 text-white hover:bg-teal-300 hover:text-teal-900 p-2 text-xl rounded-md"
      >
        Sign Up
      </Link>
    </div>
  );
};

export default Home;
