import { Table } from "flowbite-react";

import useAuth from "../../Hooks/useAuth";
import useGetTransactions from "../../Hooks/useGetTransactions";

const TransactionHistory = () => {
  const { user } = useAuth();
  const [transactions, refetch] = useGetTransactions();
  return (
    <div className="my-10">
      <h3 className="text-center text-3xl py-3">Transaction History:</h3>

      <div className="lg:w-[70%] mx-auto">
        <div className="overflow-x-auto  ">
          <Table>
            <Table.Head>
              <Table.HeadCell className="pr-2 md:pr-5 lg:pr-12">
                Date & Time
              </Table.HeadCell>
              <Table.HeadCell className="pr-2 md:pr-5 lg:pr-12">
                Sender
              </Table.HeadCell>
              <Table.HeadCell className="pr-2 md:pr-5 lg:pr-12">
                Receiver
              </Table.HeadCell>
              <Table.HeadCell className="pr-2 md:pr-5 lg:pr-12">
                Amount
              </Table.HeadCell>
              <Table.HeadCell className="pr-2 md:pr-5 lg:pr-12">
                Type
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {transactions &&
                transactions.map((transaction, index) => (
                  <Table.Row
                    key={index}
                    className="bg-white  whitespace-nowrap font-medium text-gray-900 text-center"
                  >
                    <Table.Cell className="pr-2 md:pr-5 lg:pr-12">
                      {new Date(transaction.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Table.Cell>
                    <Table.Cell className="pr-2 md:pr-5 lg:pr-12">
                      {transaction.sender}
                    </Table.Cell>
                    <Table.Cell className="pr-2 md:pr-5 lg:pr-12">
                      {transaction.receiver}
                    </Table.Cell>
                    <Table.Cell className="pr-2 md:pr-5 lg:pr-12">
                      ${transaction.amount}
                    </Table.Cell>
                    <Table.Cell>{transaction.type}</Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
