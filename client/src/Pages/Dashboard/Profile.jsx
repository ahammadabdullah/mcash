import BalanceCard from "../../Components/Dashboard/BalanceCard";
import QuickActions from "../../Components/Dashboard/QuickActions";
import TransactionHistory from "../../Components/Dashboard/TransactionHistory";
import useAuth from "../../Hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();
  return (
    <div>
      <h3 className="text-center text-3xl">
        Welcome to your profile "{user?.name}"
      </h3>
      <BalanceCard />
      <QuickActions />
      <TransactionHistory />
    </div>
  );
};

export default Profile;
