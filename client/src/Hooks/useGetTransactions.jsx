import React from "react";
import { getUserTransactions } from "../lib/apis";
import useAuth from "./useAuth";
import { useQuery } from "@tanstack/react-query";

const useGetTransactions = (number = 0) => {
  const { user } = useAuth();
  let findingNumber;
  if (number) {
    findingNumber = number;
  } else {
    findingNumber = user?.number;
  }
  const { data, refetch } = useQuery({
    queryKey: ["user-transactions"],
    queryFn: async () => await getUserTransactions(findingNumber),
    enabled: user !== null,
  });
  return [data, refetch];
};

export default useGetTransactions;
