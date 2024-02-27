import React from "react";
import Container from "../Container";
import { Table } from "flowbite-react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  acceptCashRequest,
  acceptWithdrawRequest,
  getCashRequests,
  getWithdrawRequest,
} from "../../lib/apis";

const WithDrawRequest = () => {
  const { data = [], refetch } = useQuery({
    queryKey: ["withdrawRequests"],
    queryFn: async () => getWithdrawRequest(),
  });
  const handleWithDrawApprove = async (id, amount, agentNumber) => {
    const res = await acceptWithdrawRequest(id, amount, agentNumber);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    refetch();
  };

  return (
    <div>
      <Container title={`Withdraw Request ${data?.length}`}>
        <div className="overflow-x-auto my-5">
          {data?.length !== 0 ? (
            <Table>
              <Table.Head>
                <Table.HeadCell>Number</Table.HeadCell>
                <Table.HeadCell>status</Table.HeadCell>
                <Table.HeadCell>Amount</Table.HeadCell>
                <Table.HeadCell>date</Table.HeadCell>
                <Table.HeadCell>Approve</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {data &&
                  data.map((agent, index) => (
                    <Table.Row
                      key={index}
                      className="bg-white  whitespace-nowrap font-medium text-gray-900 text-center"
                    >
                      <Table.Cell className="pr-2">
                        {agent.agentNumber}
                      </Table.Cell>
                      <Table.Cell className="pr-2">{agent.status}</Table.Cell>
                      <Table.Cell className="pr-2">{agent.amount}</Table.Cell>
                      <Table.Cell className="pr-2">
                        {" "}
                        {new Date(agent.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Table.Cell>
                      <Table.Cell className="pr-2">
                        <button
                          onClick={() => {
                            handleWithDrawApprove(
                              agent._id,
                              agent.amount,
                              agent.agentNumber
                            );
                          }}
                          className="bg-green-500 text-white p-2 rounded-md"
                        >
                          Approve
                        </button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          ) : (
            <h1 className="text-center text-2xl"></h1>
          )}
        </div>
      </Container>
    </div>
  );
};

export default WithDrawRequest;
