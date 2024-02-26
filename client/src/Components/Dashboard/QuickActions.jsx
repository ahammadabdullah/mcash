import { useState } from "react";
import SendMoneyModal from "./Modals/SendMoneyModal";

const QuickActions = () => {
  const [sendMoneyModalOpen, setSendMoneyModalOpen] = useState(false);
  return (
    <>
      <div>
        <h3 className="text-center text-3xl my-6">Quick Actions: </h3>
        <div className=" flex justify-center gap-5">
          <button
            onClick={() => setSendMoneyModalOpen(!sendMoneyModalOpen)}
            className="w-[100px] bg-blue-500 text-white p-2 rounded-lg"
          >
            Send Money
          </button>

          <button className="w-[100px] bg-red-500 text-white p-2 rounded-lg">
            Cash Out
          </button>
        </div>
      </div>
      <SendMoneyModal
        sendMoneyModalOpen={sendMoneyModalOpen}
        setSendMoneyModalOpen={setSendMoneyModalOpen}
      />
    </>
  );
};

export default QuickActions;
