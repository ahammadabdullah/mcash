import React from "react";
import AgentRequest from "../../Components/Dashboard/AgentRequest";
import CashRequest from "../../Components/Dashboard/CashRequest";
import WithDrawRequest from "../../Components/Dashboard/WithDrawRequest";

const Requests = () => {
  return (
    <div>
      <AgentRequest />
      <CashRequest />
      <WithDrawRequest />
    </div>
  );
};

export default Requests;
