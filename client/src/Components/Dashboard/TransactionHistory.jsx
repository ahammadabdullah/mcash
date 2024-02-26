import { Table } from "flowbite-react";

const TransactionHistory = () => {
  const transactions = [
    {
      date: "2024-02-26 10:00:00",
      sender: "01830845302",
      receiver: "0298389034",
      amount: 100,
      type: "Sent",
    },
    {
      date: "2024-02-25 15:30:00",
      sender: "01830845302",
      receiver: "09876543210", // Replace with another phone number
      amount: 50,
      type: "Cash Out",
    },
    {
      date: "2024-02-24 12:00:00",
      sender: "09876543210", // Replace with another phone number
      receiver: "0298389034",
      amount: 200,
      type: "Cash In",
    },
    {
      date: "2024-02-23 09:00:00",
      sender: "01830845302",
      receiver: "0298389034",
      amount: 75,
      type: "Sent",
    },
  ];
  return (
    <div className="my-10">
      <h3 className="text-center text-3xl py-3">Transaction History:</h3>

      <div className="overflow-x-auto ">
        <Table>
          <Table.Head>
            <Table.HeadCell>Date & Time</Table.HeadCell>
            <Table.HeadCell>Sender</Table.HeadCell>
            <Table.HeadCell>Receiver</Table.HeadCell>
            <Table.HeadCell>Amount</Table.HeadCell>
            <Table.HeadCell>Type</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {transactions &&
              transactions.map((transaction, index) => (
                <Table.Row
                  key={index}
                  className="bg-white  whitespace-nowrap font-medium text-gray-900"
                >
                  <Table.Cell className="pr-2">{transaction.date}</Table.Cell>
                  <Table.Cell className="pr-2">{transaction.sender}</Table.Cell>
                  <Table.Cell className="pr-2">
                    {transaction.receiver}
                  </Table.Cell>
                  <Table.Cell className="pr-2">
                    ${transaction.amount}
                  </Table.Cell>
                  <Table.Cell>{transaction.type}</Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default TransactionHistory;
