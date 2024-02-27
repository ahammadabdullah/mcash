import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import toast from "react-hot-toast";

const Login = () => {
  const { loginWithNumber } = useAuth();
  const navigate = useNavigate();

  const regex = /^(013|014|015|016|017|018|019)\d{8}$/;
  const pinRegex = /^\d{5}$/;

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const number = form.number.value;
    const pin = form.pin.value;
    const isValid = regex.test(number);
    const isPinValid = pinRegex.test(pin);

    if (!isValid) {
      toast.error("Provide a valid 11 digit Bangladeshi Number");
      return;
    }
    if (!isPinValid) {
      toast.error("Pin must be 5 digit long");
      return;
    }
    const loginInfo = {
      number,
      pin,
    };

    const res = await loginWithNumber(loginInfo);
    if (res.success === true) {
      toast.success("Login Successful");
      navigate("/dashboard");
    } else {
      toast.error(res.response.data.message);
    }
  };

  return (
    <div>
      <h3 className="text-2xl mt-10 text-center">Welcome Back</h3>
      <form
        onSubmit={handleLogin}
        className="flex flex-col justify-center w-[80%] md:w-[70%] lg:w-[40%] mx-auto lg:p-10"
      >
        <label htmlFor="number">Number:</label>
        <input
          required
          className="bg-fill p-2 focus:bg-fill ring-0 focus:border-fill rounded-md"
          type="number"
          name="number"
          id="number"
        />
        <br />
        <label htmlFor="pin">pin:</label>
        <input
          required
          className="bg-fill p-2 focus:bg-fill ring-0 focus:border-fill rounded-md"
          type="number"
          name="pin"
          id="pin"
        />

        <br />
        <button
          className="bg-fill p-2 w-full rounded-md hover:bg-primary text-black border-2 border-black"
          type="submit"
        >
          Login
        </button>
      </form>
      <p className="text-center">
        New Here ?{" "}
        <Link className="text-black" to={"/register"}>
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;
