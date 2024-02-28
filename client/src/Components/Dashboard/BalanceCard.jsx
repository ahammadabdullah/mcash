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
      <div className="w-fit flex items-center gap-5 mx-auto mt-10">
        <h3 className="">Total Balance: </h3>
        <div className="relative py-1 px-2 ">
          <div
            title="Click to show/hide the total balance"
            onClick={handleClick}
            className={`cursor-pointer absolute inset-0 glass z-10   rounded-lg  ${
              isVisible ? "hidden" : ""
            }`}
          />
          <div
            className={`text-3xl font-bold  cursor-pointer ${
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
        <div className="w-fit flex items-center gap-5 mx-auto mt-10">
          <h3>Total Income: </h3>
          <div className="relative py-1 px-2 ">
            <div
              title="Click to show/hide the total balance"
              onClick={handleClick}
              className={`cursor-pointer absolute inset-0 glass z-10   rounded-lg  ${
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
                ? user?.balance
                : user?.income === undefined
                ? "0"
                : user?.income}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BalanceCard;
