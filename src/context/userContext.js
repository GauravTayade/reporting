import {createContext} from "react";

const userContext = createContext({
  reportStartDate:null,
  reportEndDate:null,
  selectedCustomer: [], selectedReports: []
})

export default userContext;