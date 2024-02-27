import { useState } from "react";
import SendMoneyModal from "./Modals/SendMoneyModal";
import CashInModal from "./Modals/CashInModal";
import CashOutModal from "./Modals/CashOutModal";
import CashRequestModal from "./Modals/CashRequestModal";
import WithdrawRequestModal from "./Modals/WithdrawRequestModal";

const QuickActions = () => {
  const [sendMoneyModalOpen, setSendMoneyModalOpen] = useState(false);
  const [cashInModalOpen, setCashInModalOpen] = useState(false);
  const [cashOutModalOpen, setCashOutModalOpen] = useState(false);
  const [cashRequestModalOpen, setCashRequestModalOpen] = useState(false);
  const [withdrawRequestModalOpen, setWithdrawRequestModalOpen] =
    useState(false);

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
          {/* cash in for agent */}
          <button
            onClick={() => setCashInModalOpen(!cashInModalOpen)}
            className="w-[100px] bg-green-500 text-white p-2 rounded-lg"
          >
            Cash in
          </button>
          {/* cash request for agent */}
          <button
            onClick={() => setCashRequestModalOpen(!cashRequestModalOpen)}
            className="w-[100px] bg-green-500 text-white p-2 rounded-lg"
          >
            Cash Request
          </button>
          {/* withdraw request for agent */}
          <button
            onClick={() =>
              setWithdrawRequestModalOpen(!withdrawRequestModalOpen)
            }
            className="w-[100px] bg-green-500 text-white p-2 rounded-lg"
          >
            Withdraw Request
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
      <CashRequestModal
        cashRequestModalOpen={cashRequestModalOpen}
        setCashRequestModalOpen={setCashRequestModalOpen}
      />
      <WithdrawRequestModal
        withdrawRequestModalOpen={withdrawRequestModalOpen}
        setWithdrawRequestModalOpen={setWithdrawRequestModalOpen}
      />
    </>
  );
};

export default QuickActions;
