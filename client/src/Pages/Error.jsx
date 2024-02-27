import React from "react";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="flex items-center justify-center flex-col gap-3 h-screen">
      <h1>Oops! Something went wrong.</h1>
      <p>We apologize for the inconvenience.</p>
      <Link
        to={"/dashboard"}
        className="bg-blue-400 p-2 rounded-md text-white font-semibold"
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default Error;
