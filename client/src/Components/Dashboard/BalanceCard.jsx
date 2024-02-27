import { useState } from "react";
import useGetUserInfos from "../../Hooks/useGetUserInfos";
import useGetTotalBalance from "../../Hooks/useGetTotalBalance";
import useAuth from "../../Hooks/useAuth";

const BalanceCard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [data] = useGetUserInfos();
  const [totalBalance] = useGetTotalBalance();
  const { user } = useAuth();
  const handleClick = () => {
    setIsVisible(!isVisible);
  };
  return (
    <div>
      <div className="w-fit flex items-center gap-5">
        <h3>Total Balance: </h3>
        <div className="relative py-1 px-2 ">
          <div
            className={`absolute inset-0 bg-gray-300 opacity-100 backdrop-blur-3xl blur-2 filter grayscale pointer-events-none  rounded-lg  ${
              isVisible ? "hidden" : ""
            }`}
          />
          <div
            className={`text-3xl font-bold cursor-pointer ${
              isVisible ? "opacity-100" : "opacity-20"
            } `}
            onClick={handleClick}
          >
            {user?.email === "admin@mcash.com"
              ? totalBalance?.total
              : data?.balance}
          </div>
        </div>
      </div>
      {user?.role !== "user" && (
        <div className="w-fit flex items-center gap-5">
          <h3>Total Income: </h3>
          <div className="relative py-1 px-2 ">
            <div
              className={`absolute inset-0 bg-gray-300 opacity-100 backdrop-blur-3xl blur-2 filter grayscale pointer-events-none  rounded-lg  ${
                isVisible ? "hidden" : ""
              }`}
            />
            <div
              className={`text-3xl font-bold cursor-pointer ${
                isVisible ? "opacity-100" : "opacity-20"
              } `}
              onClick={handleClick}
            >
              {user?.email === "admin@mcash.com" ? user?.balance : user?.income}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BalanceCard;
