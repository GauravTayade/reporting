import {createContext} from "react";

const userContext = createContext({
  selectedCustomer: [], selectedReports: []
})

export default userContext;