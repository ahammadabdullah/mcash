import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import getAgents from "../../../Hooks/getAgents";
import useAuth from "../../../Hooks/useAuth";
import { cashOut } from "../../../lib/apis";
import toast from "react-hot-toast";
import useGetUserInfos from "../../../Hooks/useGetUserInfos";
import useGetTransactions from "../../../Hooks/useGetTransactions";

const CashOutModal = ({ setCashOutModalOpen, cashOutModalOpen }) => {
  const [fee, setFee] = useState(0);
  const [agents, refetch] = getAgents();
  const [data, balanceRefetch] = useGetUserInfos();
  const [transactions, transactionRefetch] = useGetTransactions();

  const { user } = useAuth();
  function closeModal() {
    setCashOutModalOpen(false);
    setFee(0);
  }

  const handleFee = (e) => {
    const amount = e.target.value;
    const fee = (amount / 100) * 1.5;
    setFee(fee);
  };

  const handleCashOut = async (e) => {
    e.preventDefault();
    console.log("Cash Out");
    const amount = e.target.amount.value;
    const agentNumber = e.target.agent.value;
    const pin = e.target.pin.value;
    const info = {
      amount,
      agentNumber,
      pin,
      userNumber: user.number,
    };
    const res = await cashOut(info);
    if (res.success === true) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    console.log(res);
    balanceRefetch();
    transactionRefetch();
  };
  return (
    <Transition appear show={cashOutModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-fit max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Cash Out
                </Dialog.Title>
                <form className="space-y-3  my-5" onSubmit={handleCashOut}>
                  <label className="text-sm" htmlFor="agent">
                    Select Your Agent:
                  </label>
                  <br />
                  <select
                    className="rounded-md border border-gray-300 p-2 !mt-0"
                    name="agent"
                    id="agent"
                  >
                    {agents?.map((agent, index) => (
                      <option key={index} value={agent.number}>
                        {agent.name} - {agent.number}
                      </option>
                    ))}
                  </select>

                  <br />
                  <label className="text-sm" htmlFor="recipientNumber">
                    Enter Amount:
                  </label>
                  <br />

                  <input
                    onChange={handleFee}
                    placeholder="Amount in BDT"
                    className="rounded-md border border-gray-300 p-2 !mt-0 "
                    type="number"
                    name="amount"
                    id="amount"
                  />
                  <br />
                  {fee > 0 && (
                    <p className=" italic text-sm text-red-600">
                      Fee: {fee} TK
                    </p>
                  )}
                  <label className="text-sm " htmlFor="recipientNumber">
                    Enter Your 5 Digit Pin:
                  </label>
                  <br />
                  <input
                    placeholder="*****"
                    className="rounded-md border border-gray-300 p-2 !mt-0  !mb-2"
                    type="number"
                    name="pin"
                    id="pin"
                  />
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cash Out
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
export default CashOutModal;
