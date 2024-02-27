import React from "react";
import useAuth from "./useAuth";
import { useQuery } from "@tanstack/react-query";
import { getUserInfos } from "../lib/apis";

const useGetUserInfos = () => {
  const { user } = useAuth();
  const { data, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await getUserInfos(user.number),
    enabled: user !== null,
  });
  return [data, refetch];
};

export default useGetUserInfos;
