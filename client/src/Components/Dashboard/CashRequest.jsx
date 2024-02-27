import React from "react";
import Container from "../Container";
import { Table } from "flowbite-react";
import { useQuery } from "@tanstack/react-query";
import { acceptCashRequest, getCashRequests } from "../../lib/apis";
import toast from "react-hot-toast";

const CashRequest = () => {
  const { data = [], refetch } = useQuery({
    queryKey: ["cashRequests"],
    queryFn: async () => getCashRequests(),
  });
  const handleCashApprove = async (id, agentNumber) => {
    const res = await acceptCashRequest(id, agentNumber);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    refetch();
  };

  return (
    <div>
      <Container title={`Cash Request: ${data?.length}`}>
        <div className="overflow-x-auto my-5">
          {data?.length !== 0 ? (
            <Table>
              <Table.Head>
                <Table.HeadCell>Number</Table.HeadCell>
                <Table.HeadCell>status</Table.HeadCell>
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
                            handleCashApprove(agent._id, agent.agentNumber);
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

export default CashRequest;
