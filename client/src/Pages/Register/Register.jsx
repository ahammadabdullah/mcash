import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";

const Register = () => {
  const { registerWithNumber } = useAuth();
  const navigate = useNavigate();
  const regex = /^(013|014|015|016|017|018|019)\d{8}$/;
  const pinRegex = /^\d{5}$/;
  const handleRegistration = async (e) => {
    e.preventDefault();
    const form = e.target;
    const number = form.number.value;
    const email = form.email.value;
    const pin = form.pin.value;
    const role = form.role.value;
    const name = form.name.value;
    const NID = form.NID.value;
    const isValid = regex.test(number);
    const isPinValid = pinRegex.test(pin);
    const userData = {
      name,
      NID,
      email,
      pin,
      number,
      role,
    };
    if (!isValid) {
      toast.error("Provide a valid 11 digit Bangladeshi Number");
      return;
    }
    if (!isPinValid) {
      toast.error("Pin must be 5 digit long");
      return;
    }

    const res = await registerWithNumber(userData);
    if (res.success === true) {
      toast.success("Registration Successful");
      navigate("/dashboard");
    } else {
      toast.error(res?.response?.data?.message);
    }
  };

  return (
    <div>
      <h3 className="text-2xl text-center">Welcome to MCash</h3>
      <form
        onSubmit={handleRegistration}
        className="flex flex-col justify-center w-[80%] mx-auto lg:p-10"
      >
        <label htmlFor="name">Name:</label>
        <input
          required
          className="bg-fill p-2 focus:bg-fill ring-0 focus:border-fill rounded-md"
          type="text"
          name="name"
          id="name"
        />
        <br />
        <label htmlFor="email">Email:</label>
        <input
          required
          className="bg-fill p-2 focus:bg-fill ring-0 focus:border-fill rounded-md"
          type="text"
          name="email"
          id="email"
        />
        <label htmlFor="NID">NID Number:</label>
        <input
          required
          className="bg-fill p-2 focus:bg-fill ring-0 focus:border-fill rounded-md"
          type="number"
          name="NID"
          id="NID"
        />
        <br />
        <label htmlFor="number">Mobile:</label>
        <input
          required
          className="bg-fill p-2 focus:bg-fill ring-0 focus:border-fill rounded-md"
          type="tel"
          name="number"
          id="number"
        />
        <br />
        <label htmlFor="pin">pin:</label>
        <input
          required
          className="bg-fill p-2 focus:bg-fill ring-0 focus:border-fill rounded-md"
          type="number"
          maxLength="5"
          name="pin"
          id="pin"
        />
        <br />

        <label htmlFor="role">Role:</label>
        <select
          required
          className="bg-fill p-2 focus:bg-fill ring-0 focus:border-fill rounded-md"
          name="role"
          id="role"
        >
          <option disabled>Select Account Type</option>
          <option value="user">User</option>
          <option value="agent">Agent</option>
        </select>
        <br />
        <button
          className="bg-fill p-2 w-full rounded-md hover:bg-primary text-black  border-2 border-black"
          type="submit"
        >
          Register
        </button>
      </form>

      <p className="text-center">
        Already have an account ?{" "}
        <Link className="text-black" to={"/login"}>
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
