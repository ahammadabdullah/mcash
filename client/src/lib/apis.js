import useAxiosPublic from "../Hooks/useAxiosPublic";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const axiosPublic = useAxiosPublic();
const axiosSecure = useAxiosSecure();

export const logout = async (number) => {
  try {
    const res = await axiosPublic.put("/logout", { number });
    if (res.data.success === true) {
      localStorage.removeItem("number");
    }
    return res.data;
  } catch (err) {
    return err;
  }
};

export const sendMoney = async (info) => {
  const { data } = await axiosSecure.post("/sendMoney", info);
  return data;
};

export const getUserTransactions = async (number) => {
  const { data } = await axiosSecure.get(`/userTransactions/${number}`);
  return data;
};

export const getAllTransactions = async () => {
  const { data } = await axiosSecure.get(`/transactions`);
  return data;
};

export const getUserInfos = async (number) => {
  const { data } = await axiosSecure.get(`/users/${number}`);
  return data;
};

export const getAgentRequests = async () => {
  const { data } = await axiosSecure.get("/agentRequests");
  return data;
};

export const approveAgent = async (id) => {
  const { data } = await axiosSecure.put(`/approveAgent/${id}`);
  return data;
};
export const declineAgent = async (id) => {
  const { data } = await axiosSecure.put(`/declineAgent/${id}`);
  return data;
};

export const getVerifiedAgent = async () => {
  const { data } = await axiosSecure.get("/verifiedAgents");
  return data;
};

export const cashOut = async (info) => {
  const { data } = await axiosSecure.post("/cashOut", info);
  return data;
};

export const cashIn = async (info) => {
  const { data } = await axiosSecure.post("/cashIn", info);
  return data;
};

export const getTotalBalance = async () => {
  const { data } = await axiosSecure.get("/totalBalance");
  return data;
};

export const getAllUser = async () => {
  const { data } = await axiosSecure.get("/allUsers");
  return data;
};

export const userAction = async (id) => {
  const { data } = await axiosSecure.put(`/userAction/${id}`);
  return data;
};

export const cashRequest = async (info) => {
  const { data } = await axiosSecure.post("/cashRequest", info);
  return data;
};

export const getCashRequests = async () => {
  const { data } = await axiosSecure.get("/cashRequestsForAdmin");
  return data;
};

export const acceptCashRequest = async (id, agentNumber) => {
  const { data } = await axiosSecure.put(`/acceptCashRequest/${id}`, {
    number: agentNumber,
  });
  return data;
};

export const withDrawRequest = async (info) => {
  const { data } = await axiosSecure.post("/withDrawRequest", info);
  return data;
};

export const getWithdrawRequest = async () => {
  const { data } = await axiosSecure.get("/withdrawRequests");
  return data;
};

export const acceptWithdrawRequest = async (id, amount, agentNumber) => {
  const { data } = await axiosSecure.put(`/acceptWithdrawRequest/${id}`, {
    amount,
    agentNumber,
  });
  return data;
};
