import { useState } from "react";
import SendMoneyModal from "./Modals/SendMoneyModal";
import CashInModal from "./Modals/CashInModal";
import CashOutModal from "./Modals/CashOutModal";

const QuickActions = () => {
  const [sendMoneyModalOpen, setSendMoneyModalOpen] = useState(false);
  const [cashInModalOpen, setCashInModalOpen] = useState(false);
  const [cashOutModalOpen, setCashOutModalOpen] = useState(false); //

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

          <button
            onClick={() => setCashOutModalOpen(!sendMoneyModalOpen)}
            className="w-[100px] bg-red-500 text-white p-2 rounded-lg"
          >
            Cash Out
          </button>
          <button
            onClick={() => setCashInModalOpen(!cashInModalOpen)}
            className="w-[100px] bg-green-500 text-white p-2 rounded-lg"
          >
            Cash in
          </button>
        </div>
      </div>
      <SendMoneyModal
        sendMoneyModalOpen={sendMoneyModalOpen}
        setSendMoneyModalOpen={setSendMoneyModalOpen}
      />
      <CashInModal
        cashInModalOpen={cashInModalOpen}
        setCashInModalOpen={setCashInModalOpen}
      />

      <CashOutModal
        cashOutModalOpen={cashOutModalOpen}
        setCashOutModalOpen={setCashOutModalOpen}
      />
    </>
  );
};

export default QuickActions;
