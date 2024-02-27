import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getVerifiedAgent } from "../lib/apis";

const getAgents = () => {
  const { data, refetch } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => await getVerifiedAgent(),
  });
  return [];
};

export default getAgents;
