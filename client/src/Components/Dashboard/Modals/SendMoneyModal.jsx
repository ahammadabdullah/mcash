import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import { sendMoney } from "../../../lib/apis";
import toast from "react-hot-toast";
import useGetUserInfos from "../../../Hooks/useGetUserInfos";
import useGetTransactions from "../../../Hooks/useGetTransactions";

const SendMoneyModal = ({ sendMoneyModalOpen, setSendMoneyModalOpen }) => {
  const [fee, setFee] = useState(0);
  const [data, balanceRefetch] = useGetUserInfos();
  const [transactions, transactionRefetch] = useGetTransactions();
  const { user } = useAuth();
  function closeModal() {
    setSendMoneyModalOpen(false);
    setFee(0);
  }
  const handleSendMoney = async (e) => {
    e.preventDefault();
    const amount = e.target.amount.value;
    const receiver = e.target.recipientNumber.value;
    const pin = e.target.pin.value;
    const info = {
      sender: user.number,
      amount,
      receiver,
      pin,
    };
    if (amount < 50) {
      toast.error("You can't send less than 50 TK");
      return;
    }
    if (user.number === receiver) {
      toast.error("You can't send money to yourself");
      return;
    }
    const res = await sendMoney(info);
    if (res.success === true) {
      toast.success("Money sent successfully");
    } else {
      toast.error(res.message);
    }
    balanceRefetch();
    transactionRefetch();
  };
  const handleFee = (e) => {
    const amount = e.target.value;
    if (amount > 100) {
      setFee(5);
    } else {
      setFee(0);
    }
  };
  return (
    <Transition appear show={sendMoneyModalOpen} as={Fragment}>
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
                  Send Money
                </Dialog.Title>
                <form onSubmit={handleSendMoney} className="space-y-3  my-5">
                  <label className="text-sm" htmlFor="recipientNumber">
                    Enter Recipient Number:
                  </label>
                  <br />
                  <input
                    placeholder="01*********"
                    className="rounded-md border border-gray-300 p-2 !mt-0 !mb-2"
                    type="number"
                    name="recipientNumber"
                    id="recipientNumber"
                  />
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
                      Send
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

export default SendMoneyModal;
