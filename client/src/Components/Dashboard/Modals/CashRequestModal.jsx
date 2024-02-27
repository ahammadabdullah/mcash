import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import useAuth from "../../../Hooks/useAuth";
import { cashRequest } from "../../../lib/apis";
import toast from "react-hot-toast";

const CashRequestModal = ({
  cashRequestModalOpen,
  setCashRequestModalOpen,
}) => {
  const { user } = useAuth();
  function closeModal() {
    setCashRequestModalOpen(false);
  }
  const handleCashRequest = async () => {
    const info = {
      status: "pending",
      type: "cash",
      agentNumber: user.number,
      date: new Date(),
    };
    const res = await cashRequest(info);
    if (res.success === true) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    closeModal();
  };
  return (
    <Transition appear show={cashRequestModalOpen} as={Fragment}>
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
                  Request For Cash
                </Dialog.Title>
                <div className="flex gap-5  mt-5">
                  <button
                    onClick={handleCashRequest}
                    className="bg-green-500 text-white rounded-md p-2"
                  >
                    Submit Request
                  </button>
                  <button
                    className="bg-red-500 text-white rounded-md p-2"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CashRequestModal;
