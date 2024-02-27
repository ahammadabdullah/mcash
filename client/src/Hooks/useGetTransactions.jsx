import React from "react";
import { getAllTransactions, getUserTransactions } from "../lib/apis";
import useAuth from "./useAuth";
import { useQuery } from "@tanstack/react-query";

const useGetTransactions = () => {
  const { user } = useAuth();
  const { data, refetch } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      let fetcher;
      if (user.email === "admin@mcash.com") {
        fetcher = getAllTransactions();
      } else {
        fetcher = getUserTransactions(user.number);
      }
      return await fetcher;
    },
    enabled: user !== null,
  });
  return [data, refetch];
};

export default useGetTransactions;
