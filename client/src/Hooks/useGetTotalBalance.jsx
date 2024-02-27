import { useQuery } from "@tanstack/react-query";
import { getTotalBalance } from "../lib/apis";

const useGetTotalBalance = () => {
  const { data, refetch } = useQuery({
    queryKey: ["totalBalance"],
    queryFn: async () => await getTotalBalance(),
  });
  return [data, refetch];
};

export default useGetTotalBalance;
