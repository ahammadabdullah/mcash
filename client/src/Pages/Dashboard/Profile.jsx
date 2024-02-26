import BalanceCard from "../../Components/Dashboard/BalanceCard";
import QuickActions from "../../Components/Dashboard/QuickActions";

const Profile = () => {
  return (
    <div>
      <h3 className="text-center">Welcome to your profile</h3>
      <BalanceCard />
      <QuickActions />
    </div>
  );
};

export default Profile;
