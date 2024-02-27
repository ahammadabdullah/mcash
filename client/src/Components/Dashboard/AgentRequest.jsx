import React from "react";
import Container from "../Container";
import { Table } from "flowbite-react";
import { useQuery } from "@tanstack/react-query";
import { approveAgent, getAgentRequests } from "../../lib/apis";
import toast from "react-hot-toast";

const AgentRequest = () => {
  const { data, refetch } = useQuery({
    queryKey: ["agentRequests"],
    queryFn: async () => getAgentRequests(),
  });

  const handleAgentApprove = async (id) => {
    const res = await approveAgent(id);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    refetch();
  };
  const handleAgentDecline = async (id) => {
    const res = await handleAgentDecline(id);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    refetch();
  };
  return (
    <div>
      <Container title={`Agent Request: ${data?.length}`}>
        <div className="overflow-x-auto my-5">
          {data?.length !== 0 ? (
            <Table>
              <Table.Head>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Number</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Approve</Table.HeadCell>
                <Table.HeadCell>Decline</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {data &&
                  data.map((agent, index) => (
                    <Table.Row
                      key={index}
                      className="bg-white  whitespace-nowrap font-medium text-gray-900 text-center"
                    >
                      <Table.Cell className="pr-2">{agent.name}</Table.Cell>
                      <Table.Cell className="pr-2">{agent.number}</Table.Cell>
                      <Table.Cell className="pr-2">{agent.email}</Table.Cell>
                      <Table.Cell className="pr-2">
                        <button
                          onClick={() => {
                            handleAgentApprove(agent._id);
                          }}
                          className="bg-green-500 text-white p-2 rounded-md"
                        >
                          Approve
                        </button>
                      </Table.Cell>
                      <Table.Cell>
                        <button
                          onClick={() => {
                            handleAgentDecline(agent._id);
                          }}
                          className="bg-red-500 text-white p-2 rounded-md"
                        >
                          Decline
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

export default AgentRequest;
