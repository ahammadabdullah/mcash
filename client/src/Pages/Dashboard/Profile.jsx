import BalanceCard from "../../Components/Dashboard/BalanceCard";
import QuickActions from "../../Components/Dashboard/QuickActions";
import TransactionHistory from "../../Components/Dashboard/TransactionHistory";
import useAuth from "../../Hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();
  return (
    <div>
      <h3 className="text-center text-3xl my-5">
        Welcome to your profile "{user?.name}"
      </h3>
      <p className="text-center ">{user?.email}</p>
      <p className="text-center ">{user?.number}</p>
      <BalanceCard />

      {user.role !== "admin" && (
        <>
          <QuickActions />
          <TransactionHistory />
        </>
      )}
    </div>
  );
};

export default Profile;
