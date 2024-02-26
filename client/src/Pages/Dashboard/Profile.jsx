import BalanceCard from "../../Components/Dashboard/BalanceCard";
import QuickActions from "../../Components/Dashboard/QuickActions";
import TransactionHistory from "../../Components/Dashboard/TransactionHistory";

const Profile = () => {
  return (
    <div>
      <h3 className="text-center">Welcome to your profile</h3>
      <BalanceCard />
      <QuickActions />
      <TransactionHistory />
    </div>
  );
};

export default Profile;
