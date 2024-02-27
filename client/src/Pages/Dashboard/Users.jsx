import { Table } from "flowbite-react";
import React from "react";
import Container from "../../Components/Container";
import { useQuery } from "@tanstack/react-query";
import { getAllUser, userAction } from "../../lib/apis";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Users = () => {
  const { data, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => getAllUser(),
  });
  const handleUserAction = async (id) => {
    const res = await userAction(id);
    if (res.success === true) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    refetch();
  };
  return (
    <div>
      <Container title={`Total Users ${data?.length}`}>
        <div className="overflow-x-auto my-5">
          {data?.length !== 0 ? (
            <Table>
              <Table.Head>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Number</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Balance</Table.HeadCell>
                <Table.HeadCell>Role</Table.HeadCell>
                <Table.HeadCell>Action</Table.HeadCell>
                <Table.HeadCell>See Transactions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {data &&
                  data.map((user, index) => (
                    <Table.Row
                      key={index}
                      className="bg-white  whitespace-nowrap font-medium text-gray-900 text-center"
                    >
                      <Table.Cell className="pr-2">{user.name}</Table.Cell>
                      <Table.Cell className="pr-2">{user.number}</Table.Cell>
                      <Table.Cell className="pr-2">{user.email}</Table.Cell>
                      <Table.Cell className="pr-2">{user.balance}</Table.Cell>
                      <Table.Cell className="pr-2">{user.role}</Table.Cell>
                      <Table.Cell className="pr-2">
                        <button
                          onClick={() => {
                            handleUserAction(user._id);
                          }}
                          className={`${
                            user.status === "verified"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }  text-white p-2 rounded-md`}
                        >
                          {user.status === "verified" ? "Block" : "Unblock"}
                        </button>
                      </Table.Cell>
                      <Table.Cell className="pr-2">
                        <Link
                          to={`/dashboard/userTransactions/${user.number}`}
                          className={"bg-blue-400 text-white p-2 rounded-md"}
                        >
                          See Transactions
                        </Link>
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

export default Users;
